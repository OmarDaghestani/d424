import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import {
  getStoredDisplayName,
  setStoredDisplayName,
  clearStoredDisplayName,
  DISPLAY_NAME_EVENT,
  resolveProfileLabel,
} from "../utils/displayName";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [accountLabel, setAccountLabel] = useState(() =>
    isAuthenticated ? getStoredDisplayName() : ""
  );
  const [profileLoading, setProfileLoading] = useState(
    () => isAuthenticated && !getStoredDisplayName()
  );
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const solidNav = !isHome || isScrolled;
  const showShadow = !isHome || isScrolled;

  const syncLabelFromStorage = useCallback(() => {
    setAccountLabel(getStoredDisplayName());
  }, []);

  const fetchProfileLabel = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const hadCachedName = !!getStoredDisplayName();
    if (!hadCachedName) setProfileLoading(true);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
      const label = resolveProfileLabel(data);
      if (label) {
        setAccountLabel(label);
        setStoredDisplayName(label);
      } else if (!hadCachedName) {
        setAccountLabel("");
      }
    } catch (error) {
      console.error("Failed to fetch profile for navbar:", error);
      syncLabelFromStorage();
    } finally {
      setProfileLoading(false);
    }
  }, [syncLabelFromStorage]);

  useEffect(() => {
    const onDisplayNameEvent = (e) => {
      setAccountLabel(e.detail?.name || getStoredDisplayName());
    };
    window.addEventListener(DISPLAY_NAME_EVENT, onDisplayNameEvent);
    return () =>
      window.removeEventListener(DISPLAY_NAME_EVENT, onDisplayNameEvent);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setAccountLabel("");
      setProfileLoading(false);
      return;
    }
    const cached = getStoredDisplayName();
    if (cached) {
      setAccountLabel(cached);
      setProfileLoading(false);
    } else {
      setProfileLoading(true);
    }
    fetchProfileLabel();
  }, [isAuthenticated, fetchProfileLabel]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsBurgerOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearStoredDisplayName();
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setAccountLabel("");
    navigate("/");
  };

  const toggleBurgerMenu = () => {
    setIsBurgerOpen((open) => !open);
  };

  const navTriggerText = profileLoading
    ? "Loading…"
    : accountLabel.trim() || "Account";

  return (
    <nav
      className={`navbar is-fixed-top techhub-navbar ${
        solidNav ? "techhub-navbar--solid" : ""
      } ${showShadow ? "has-shadow" : ""}`}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <Link className="navbar-item techhub-brand" to="/">
            <i className="fas fa-microchip mr-2" aria-hidden="true"></i>
            TechHub
          </Link>

          <button
            type="button"
            className={`navbar-burger techhub-navbar-burger ${
              isBurgerOpen ? "is-active" : ""
            }`}
            aria-label="menu"
            aria-expanded={isBurgerOpen}
            onClick={toggleBurgerMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>

        <div className={`navbar-menu ${isBurgerOpen ? "is-active" : ""}`}>
          <div className="navbar-end">
            <Link to="/products" className="navbar-item techhub-nav-item">
              Products
            </Link>

            {!isAuthenticated ? (
              <div className="navbar-item">
                <div className="buttons">
                  <Link
                    to="/login"
                    className="button is-light is-outlined techhub-button-outline"
                  >
                    Log in
                  </Link>
                  <Link to="/signup" className="button is-primary">
                    Sign up
                  </Link>
                </div>
              </div>
            ) : (
              <div className="navbar-item has-dropdown is-hoverable">
                <button
                  type="button"
                  className="navbar-link is-arrowless techhub-nav-trigger"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-label={`Account menu for ${navTriggerText}`}
                >
                  <i className="fas fa-user-circle mr-2" aria-hidden="true"></i>
                  <span
                    className={`techhub-nav-name ${
                      profileLoading ? "techhub-nav-name--loading" : ""
                    }`}
                  >
                    {navTriggerText}
                  </span>
                </button>

                <div className="navbar-dropdown is-right">
                  <Link className="navbar-item" to="/profile">
                    <i className="fas fa-id-card mr-2" aria-hidden="true"></i>
                    Profile
                  </Link>
                  <Link className="navbar-item" to="/orders">
                    <i className="fas fa-shopping-bag mr-2" aria-hidden="true"></i>
                    Orders
                  </Link>
                  <hr className="navbar-divider" />
                  <button
                    type="button"
                    className="navbar-item has-text-danger is-fullwidth"
                    style={{
                      textAlign: "left",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt mr-2" aria-hidden="true"></i>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
};

export default Navbar;
