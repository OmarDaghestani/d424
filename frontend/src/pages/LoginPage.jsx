import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { API_URL } from "../config";
import { safeRedirect } from "../utils/safeRedirect";
import { setStoredDisplayName } from "../utils/displayName";

const LoginPage = ({ setIsAuthenticated }) => {
  useDocumentTitle("Log in");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const afterAuth = safeRedirect(searchParams.get("next"));
  // Carry the return path over if the shopper switches to sign-up instead
  const nextQuery = afterAuth !== "/" ? `?next=${encodeURIComponent(afterAuth)}` : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, name } = response.data;

      localStorage.setItem("token", token);
      if (name) setStoredDisplayName(name);

      setIsAuthenticated(true);
      setError("");
      navigate(afterAuth);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === "Network Error") {
        setError("Network error. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title has-text-centered">Log in</h1>
            <form className="box" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="email">
                  Email
                </label>
                <div className="control">
                  <input
                    id="email"
                    className="input"
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="password">
                  Password
                </label>
                <div className="control">
                  <input
                    id="password"
                    className="input"
                    type="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <p className="has-text-danger has-text-centered" role="alert">
                  {error}
                </p>
              )}
              <div className="field">
                <button
                  className="button is-primary is-fullwidth"
                  type="submit"
                  disabled={!email || !password}
                >
                  Log in
                </button>
              </div>
            </form>
            <p className="has-text-centered">
              Don&apos;t have an account?{" "}
              <Link to={`/signup${nextQuery}`}>Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
