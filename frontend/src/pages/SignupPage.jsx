import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { API_URL } from "../config";
import { setStoredDisplayName } from "../utils/displayName";

const SignupPage = ({ setIsAuthenticated }) => {
  useDocumentTitle("Sign up");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      });

      const { token, name: registeredName } = response.data;
      localStorage.setItem("token", token);
      const display =
        (registeredName && String(registeredName).trim()) || name.trim();
      if (display) setStoredDisplayName(display);

      setIsAuthenticated(true);
      setError("");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-one-third">
            <h1 className="title has-text-centered">Sign up</h1>
            <form className="box" onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label className="label" htmlFor="name">
                  Name
                </label>
                <div className="control">
                  <input
                    id="name"
                    className="input"
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
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
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
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
                  disabled={!name || !email || !password}
                >
                  Sign up
                </button>
              </div>
            </form>
            <p className="has-text-centered">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupPage;
