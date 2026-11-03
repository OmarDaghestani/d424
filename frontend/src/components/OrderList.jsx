import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const shortId = (id) => {
  if (!id || typeof id !== "string") return "—";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
};

const productHref = (item) => {
  const raw = item.product;
  const id = raw && typeof raw === "object" ? raw._id : raw;
  return id ? `/product/${id}` : null;
};

const OrderList = () => {
  useDocumentTitle("Orders");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const calculateTotalQuantity = (orderItems) =>
    orderItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <button
            type="button"
            className="button is-primary is-loading"
            disabled
            aria-label="Loading orders"
          >
            Loading
          </button>
          <p className="mt-4">Loading orders…</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <div className="notification is-danger" role="alert">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Your orders</h1>
        <p className="subtitle mb-5">Track purchases and delivery status.</p>

        {orders.length === 0 ? (
          <div className="box has-text-centered py-6">
            <p className="is-size-5 mb-4">You have not placed any orders yet.</p>
            <Link to="/products" className="button is-primary">
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="order-table-wrap">
              <table className="table is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th scope="col">Order</th>
                    <th scope="col">Date</th>
                    <th scope="col">Total</th>
                    <th scope="col">Items</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <span
                          className="order-id-short"
                          title={order._id}
                        >
                          {shortId(order._id)}
                        </span>
                      </td>
                      <td>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>{calculateTotalQuantity(order.orderItems)}</td>
                      <td>
                        {order.isDelivered
                          ? "Delivered"
                          : order.isPaid
                            ? "Paid"
                            : "Awaiting payment"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="order-cards mt-4">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="level is-mobile mb-2">
                    <div className="level-left">
                      <div className="level-item">
                        <strong>Order</strong>{" "}
                        <span className="order-id-short" title={order._id}>
                          {shortId(order._id)}
                        </span>
                      </div>
                    </div>
                    <div className="level-right">
                      <span className="tag is-info is-light">
                        {order.isDelivered
                          ? "Delivered"
                          : order.isPaid
                            ? "Paid"
                            : "Awaiting payment"}
                      </span>
                    </div>
                  </div>
                  <p className="is-size-7 techhub-readable-muted mb-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="mb-2">
                    <strong>Total:</strong> ${order.totalPrice.toFixed(2)} ·{" "}
                    <strong>Items:</strong>{" "}
                    {calculateTotalQuantity(order.orderItems)}
                  </p>
                  <ul className="is-size-7">
                    {order.orderItems.map((item, idx) => {
                      const href = productHref(item);
                      return (
                        <li key={`${order._id}-${idx}`}>
                          {href ? (
                            <Link to={href}>
                              {item.quantity}× {item.name}
                            </Link>
                          ) : (
                            <>
                              {item.quantity}× {item.name}
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default OrderList;
