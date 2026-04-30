import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ProductSpecs } from "./ProductSpecs";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f5f5f5'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial' font-size='14' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="column is-3-desktop is-4-tablet is-6-mobile">
      <Link to={`/product/${product._id}`} className="product-card-link">
        <div className="card product-card">
          <div className="card-image">
            <figure className="image is-square">
              <img
                src={imageError ? PLACEHOLDER_IMAGE : product.image}
                alt={product.name}
                style={{
                  objectFit: "contain",
                  padding: imageError ? "2rem" : "1rem",
                  background: imageError ? "#f5f5f5" : "#ffffff",
                  width: "100%",
                  height: "100%",
                  maxHeight: "300px",
                  minHeight: "300px",
                }}
                onError={() => setImageError(true)}
              />
            </figure>
            {product.stock <= 5 && product.stock > 0 && (
              <div className="tag is-warning stock-tag">
                Only {product.stock} left!
              </div>
            )}
            {product.stock === 0 && (
              <div className="tag is-danger stock-tag">Out of Stock</div>
            )}
          </div>

          <div className="card-content">
            <p className="title is-5 mb-2 product-title">{product.name}</p>
            <p className="subtitle is-6 mb-2 product-brand techhub-readable-muted">
              {product.brand}
            </p>
            <div className="specifications mb-2">
              <ProductSpecs product={product} />
            </div>
            <p className="has-text-primary has-text-weight-bold is-size-5">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    brand: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    specifications: PropTypes.object.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;
