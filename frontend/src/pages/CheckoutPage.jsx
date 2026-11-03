import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { fetchProductById } from "../services/productService";
import { createOrder } from "../services/orderService";
import { confirmPayment, createPaymentIntent } from "../services/paymentService";
import { STRIPE_PUBLISHABLE_KEY } from "../config";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Portfolio demo: only ever load Stripe with a test-mode key, so a live key
// configured by mistake can't turn this into a real store.
const isTestMode = STRIPE_PUBLISHABLE_KEY.startsWith("pk_test_");
const stripePromise = isTestMode ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

const EMPTY_ADDRESS = { address: "", city: "", postalCode: "", country: "" };

const errorMessage = (err, fallback) =>
  err?.response?.data?.message || err?.message || fallback;

const formatMoney = (amount) => `$${Number(amount).toFixed(2)}`;

function DemoBanner() {
  return (
    <div className="notification is-info is-light">
      <strong>Portfolio demo — no real charges, nothing ships.</strong> Pay with Stripe&apos;s test
      card <code>4242 4242 4242 4242</code>, any future expiry, and any CVC.
    </div>
  );
}

function OrderSummary({ product, quantity, order }) {
  const unit = order?.orderItems?.[0]?.price ?? product.price;
  const total = order?.totalPrice ?? unit * quantity;
  return (
    <div className="box">
      <h2 className="title is-5">Order summary</h2>
      <div className="media">
        {product.image && (
          <figure className="media-left">
            <p className="image is-64x64">
              <img src={product.image} alt="" style={{ objectFit: "contain" }} />
            </p>
          </figure>
        )}
        <div className="media-content">
          <p className="has-text-weight-semibold">{product.name}</p>
          <p className="is-size-7 techhub-readable-muted">
            {quantity} × {formatMoney(unit)}
          </p>
        </div>
      </div>
      <hr />
      <div className="level is-mobile">
        <div className="level-left">
          <span className="has-text-weight-semibold">Total</span>
        </div>
        <div className="level-right">
          <span className="is-size-5 has-text-weight-bold">{formatMoney(total)}</span>
        </div>
      </div>
      {!order && (
        <p className="is-size-7 techhub-readable-muted">
          Final price is confirmed by the store when you continue.
        </p>
      )}
    </div>
  );
}

function ShippingForm({ onSubmit, submitting, disabled }) {
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const update = (key) => (e) => setAddress((a) => ({ ...a, [key]: e.target.value }));

  const fields = [
    { key: "address", label: "Street address", autoComplete: "street-address" },
    { key: "city", label: "City", autoComplete: "address-level2" },
    { key: "postalCode", label: "Postal code", autoComplete: "postal-code" },
    { key: "country", label: "Country", autoComplete: "country-name" },
  ];

  return (
    <form
      className="box"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(
          Object.fromEntries(Object.entries(address).map(([k, v]) => [k, v.trim()]))
        );
      }}
    >
      <h2 className="title is-5">Shipping address</h2>
      {fields.map(({ key, label, autoComplete }) => (
        <div className="field" key={key}>
          <label className="label" htmlFor={`ship-${key}`}>
            {label}
          </label>
          <div className="control">
            <input
              id={`ship-${key}`}
              className="input"
              value={address[key]}
              onChange={update(key)}
              autoComplete={autoComplete}
              required
              maxLength={120}
            />
          </div>
        </div>
      ))}
      <button
        type="submit"
        className={`button is-primary is-fullwidth mt-4 ${submitting ? "is-loading" : ""}`}
        disabled={submitting || disabled}
      >
        Continue to payment
      </button>
    </form>
  );
}

function PaymentForm({ order, onPaid }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError("");
    setPaying(true);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Only used by payment methods that require a redirect
        return_url: `${window.location.origin}/checkout/complete?order=${order._id}`,
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setPaying(false);
      return;
    }

    try {
      const paidOrder = await confirmPayment(order._id);
      onPaid(paidOrder);
    } catch (err) {
      setError(errorMessage(err, "We couldn't confirm your payment. Check your orders shortly."));
      setPaying(false);
    }
  };

  return (
    <form className="box" onSubmit={handlePay}>
      <h2 className="title is-5">Payment</h2>
      <PaymentElement />
      {error && (
        <div className="notification is-danger is-light mt-4" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className={`button is-primary is-fullwidth mt-4 ${paying ? "is-loading" : ""}`}
        disabled={!stripe || paying}
      >
        Pay {formatMoney(order.totalPrice)}
      </button>
    </form>
  );
}

function PaidConfirmation({ order }) {
  return (
    <div className="box has-text-centered py-6">
      <p className="is-size-3 mb-2" aria-hidden="true">
        ✓
      </p>
      <h2 className="title is-4">Payment received</h2>
      <p className="mb-5">
        Thanks! Your order of {formatMoney(order.totalPrice)} is confirmed and will ship to{" "}
        {order.shippingAddress?.city}.
      </p>
      <div className="buttons is-centered">
        <Link to="/orders" className="button is-primary">
          View your orders
        </Link>
        <Link to="/products" className="button is-light">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}

const CheckoutPage = () => {
  useDocumentTitle("Checkout");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const productId = params.get("product");
  const quantity = Math.max(1, parseInt(params.get("qty") || "1", 10) || 1);

  const [product, setProduct] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [paidOrder, setPaidOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate(`/login?next=${encodeURIComponent(location.pathname + location.search)}`, {
        replace: true,
      });
      return;
    }
    if (!productId) {
      setLoadError("No product selected.");
      return;
    }
    fetchProductById(productId)
      .then(setProduct)
      .catch(() => setLoadError("Failed to load this product."));
  }, [productId, navigate, location.pathname, location.search]);

  const elementsOptions = useMemo(
    () => ({ clientSecret, appearance: { theme: "stripe" } }),
    [clientSecret]
  );

  const handleShipping = async (shippingAddress) => {
    setError("");
    setSubmitting(true);
    try {
      const created = await createOrder({
        orderItems: [{ product: productId, quantity }],
        shippingAddress,
        paymentMethod: "card",
      });
      setOrder(created);
      const intent = await createPaymentIntent(created._id);
      setClientSecret(intent.clientSecret);
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <section className="section">
        <div className="container">
          <div className="notification is-danger" role="alert">
            {loadError}
          </div>
          <Link to="/products" className="button is-primary">
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  if (!product) {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <p>Loading checkout…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Checkout</h1>
        <DemoBanner />

        {!stripePromise && (
          <div className="notification is-warning is-light">
            Online payment isn&apos;t enabled for this store yet.
          </div>
        )}

        {error && (
          <div className="notification is-danger is-light" role="alert">
            {error}
          </div>
        )}

        <div className="columns">
          <div className="column is-7">
            {paidOrder ? (
              <PaidConfirmation order={paidOrder} />
            ) : order && clientSecret ? (
              <Elements stripe={stripePromise} options={elementsOptions}>
                <PaymentForm order={order} onPaid={setPaidOrder} />
              </Elements>
            ) : (
              <ShippingForm
                onSubmit={handleShipping}
                submitting={submitting}
                disabled={!stripePromise || product.stock < quantity}
              />
            )}
          </div>
          <div className="column is-5">
            <OrderSummary product={product} quantity={quantity} order={paidOrder || order} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
