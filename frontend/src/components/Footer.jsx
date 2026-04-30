import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer techhub-footer">
      <div className="container">
        <div className="columns">
          <div className="column is-4">
            <h3 className="title is-4 has-text-white mb-4">
              <i className="fas fa-microchip mr-2" aria-hidden="true"></i>
              TechHub
            </h3>
            <p className="techhub-footer-text mb-4">
              Your trusted source for premium computer hardware and components.
              Building dreams, one PC at a time.
            </p>
            <div className="mt-4">
              <a
                href="https://facebook.com"
                className="icon is-medium mr-3 techhub-social-icon"
                aria-label="Facebook"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fab fa-facebook fa-lg" aria-hidden="true"></i>
              </a>
              <a
                href="https://twitter.com"
                className="icon is-medium mr-3 techhub-social-icon"
                aria-label="Twitter"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fab fa-twitter fa-lg" aria-hidden="true"></i>
              </a>
              <a
                href="https://instagram.com"
                className="icon is-medium mr-3 techhub-social-icon"
                aria-label="Instagram"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fab fa-instagram fa-lg" aria-hidden="true"></i>
              </a>
              <a
                href="https://youtube.com"
                className="icon is-medium techhub-social-icon"
                aria-label="YouTube"
                rel="noopener noreferrer"
                target="_blank"
              >
                <i className="fab fa-youtube fa-lg" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div className="column is-2 is-offset-1">
            <h4 className="title is-5 has-text-white mb-4">Quick Links</h4>
            <ul>
              <li className="mb-2">
                <Link to="/" className="techhub-footer-link">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="techhub-footer-link">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="techhub-footer-link">
                  About Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="techhub-footer-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="column is-2">
            <h4 className="title is-5 has-text-white mb-4">Support</h4>
            <ul>
              <li className="mb-2">
                <Link to="/faq" className="techhub-footer-link">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/shipping" className="techhub-footer-link">
                  Shipping Info
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/returns" className="techhub-footer-link">
                  Returns
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="techhub-footer-link">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="column is-3">
            <h4 className="title is-5 has-text-white mb-4">Newsletter</h4>
            <p className="techhub-footer-text mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <div className="field has-addons">
              <div className="control is-expanded">
                <label className="is-sr-only" htmlFor="footer-newsletter-email">
                  Email for newsletter
                </label>
                <input
                  id="footer-newsletter-email"
                  className="input techhub-footer-newsletter-input"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />
              </div>
              <div className="control">
                <button type="button" className="button is-primary">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="techhub-footer-rule" />

        <div className="content has-text-centered techhub-footer-text">
          <p className="mb-0">© {new Date().getFullYear()} TechHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
