import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function PlaceholderPage({ title, description, points = [] }) {
  useDocumentTitle(title);

  return (
    <section className="section techhub-placeholder">
      <div className="container content is-max-desktop">
        <nav className="breadcrumb" aria-label="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li className="is-active">
              <span aria-current="page">{title}</span>
            </li>
          </ul>
        </nav>
        <h1 className="title">{title}</h1>
        <p className="subtitle is-4">{description}</p>
        {points.length > 0 && (
          <ul className="techhub-placeholder-points">
            {points.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
        <p className="mt-5">
          <Link to="/products" className="button is-primary">
            Browse products
          </Link>{" "}
          <Link to="/" className="button is-light ml-2">
            Back to home
          </Link>
        </p>
      </div>
    </section>
  );
}

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.string),
};
