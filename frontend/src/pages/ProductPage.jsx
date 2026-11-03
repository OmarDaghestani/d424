import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProductById } from "../services/productService";
import { ProductSpecs } from "../components/ProductSpecs";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const formatSpecifications = (specs) => {
  if (!specs) return {};
  return specs instanceof Map ? Object.fromEntries(specs) : specs;
};

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [quantity, setQuantity] = useState(1);

  const productForSpecs = useMemo(() => {
    if (!product) return null;
    return {
      ...product,
      specifications: formatSpecifications(product.specifications),
    };
  }, [product]);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await fetchProductById(id);
        setProduct(data);
        const max = Math.max(0, data.stock ?? 0);
        setQuantity(max > 0 ? Math.min(1, max) : 1);
      } catch {
        setLoadError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useDocumentTitle(product?.name || "Product");

  const stock = product?.stock ?? 0;
  const maxQty = Math.max(0, stock);

  const clampQuantity = (raw) => {
    const n = parseInt(String(raw), 10);
    if (Number.isNaN(n) || n < 1) return 1;
    if (maxQty > 0) return Math.min(n, maxQty);
    return n;
  };

  const handleQuantityChange = (e) => {
    setQuantity(clampQuantity(e.target.value));
  };

  const handleBuyNow = () => {
    if (!product || stock < 1) return;
    navigate(`/checkout?product=${product._id}&qty=${clampQuantity(quantity)}`);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <div className="loader-wrapper">
            <button
              type="button"
              className="button is-primary is-loading"
              disabled
              aria-label="Loading product details"
            >
              Loading
            </button>
          </div>
          <p className="mt-4">Loading product details…</p>
        </div>
      </section>
    );
  }

  if (loadError || !product) {
    return (
      <section className="section">
        <div className="container has-text-centered">
          <h1 className="title has-text-danger">{loadError || "Not found"}</h1>
          <Link to="/products" className="button is-primary mt-4">
            Back to products
          </Link>
        </div>
      </section>
    );
  }

  const outOfStock = stock < 1;

  return (
    <section className="section">
      <div className="container">
        <nav
          className="breadcrumb techhub-breadcrumb-block"
          aria-label="breadcrumbs"
        >
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li className="is-active">
              <span aria-current="page">{product.name}</span>
            </li>
          </ul>
        </nav>

        <div className="columns is-centered">
          <div className="column is-half">
            <figure className="image is-square">
              <img
                src={product.image || "https://via.placeholder.com/500x500"}
                alt={product.name}
                style={{
                  borderRadius: "8px",
                  objectFit: "contain",
                  width: "100%",
                }}
              />
            </figure>
          </div>

          <div className="column is-half">
            <h1 className="title">{product.name}</h1>
            <p className="subtitle is-5 techhub-readable-muted">{product.brand}</p>
            <p className="subtitle is-4 has-text-primary has-text-weight-semibold">
              ${product.price.toFixed(2)}
            </p>

            <div className="tags mb-4">
              <span className="tag is-info">{product.category}</span>
              {outOfStock ? (
                <span className="tag is-danger">Out of stock</span>
              ) : stock <= 5 ? (
                <span className="tag is-warning">Only {stock} left</span>
              ) : (
                <span className="tag is-success">{stock} in stock</span>
              )}
            </div>

            {productForSpecs && (
              <div className="box content is-small mb-4">
                <h2 className="title is-6">Specifications</h2>
                <ProductSpecs product={productForSpecs} />
              </div>
            )}

            <div className="box" style={{ fontSize: "1.05rem" }}>
              {product.description}
            </div>
            <p className="is-size-7 techhub-readable-muted">
              Listed {new Date(product.createdAt).toLocaleDateString()}
            </p>

            <div className="mt-5">
              <label className="label" htmlFor="product-qty">
                Quantity
              </label>
              <div className="field has-addons">
                <div className="control">
                  <input
                    id="product-qty"
                    type="number"
                    className="input"
                    value={quantity}
                    min={1}
                    max={maxQty || 1}
                    disabled={outOfStock}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className="control">
                  <button
                    type="button"
                    className="button is-static"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    max {maxQty || 0}
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="button is-primary mt-3"
                onClick={handleBuyNow}
                disabled={outOfStock}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
