import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../services/paymentService";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

// Landing page for payment methods that redirect away from the site before
// returning (cards normally complete in place on the checkout page).
const CheckoutCompletePage = () => {
  useDocumentTitle("Payment status");
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const [state, setState] = useState({ status: "checking", message: "" });

  useEffect(() => {
    if (!orderId) {
      setState({ status: "error", message: "Missing order reference." });
      return;
    }
    confirmPayment(orderId)
      .then(() => setState({ status: "paid", message: "" }))
      .catch((err) =>
        setState({
          status: "error",
          message:
            err?.response?.data?.message ||
            "We couldn't confirm this payment yet. Check your orders in a moment.",
        })
      );
  }, [orderId]);

  return (
    <section className="section">
      <div className="container has-text-centered">
        {state.status === "checking" && <p>Confirming your payment…</p>}
        {state.status === "paid" && (
          <>
            <h1 className="title">Payment received</h1>
            <p className="mb-5">Thanks! Your order is confirmed.</p>
          </>
        )}
        {state.status === "error" && (
          <div className="notification is-warning is-light" role="alert">
            {state.message}
          </div>
        )}
        <Link to="/orders" className="button is-primary">
          View your orders
        </Link>
      </div>
    </section>
  );
};

export default CheckoutCompletePage;
