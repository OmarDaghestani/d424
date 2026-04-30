import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { API_URL } from "../config";
import {
  setStoredDisplayName,
  clearStoredDisplayName,
  resolveProfileLabel,
} from "../utils/displayName";

const ProfilePage = ({ setIsAuthenticated } = {}) => {
  useDocumentTitle("Profile");

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const editSnapshot = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axios.get(
          `${API_URL}/api/users/profile`,
          config
        );
        setUserData({ name: data.name, email: data.email, password: "" });
        const label = resolveProfileLabel(data);
        if (label) setStoredDisplayName(label);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
        config
      );

      setMessage({ type: "success", text: "Profile updated successfully." });
      setUserData({ name: data.name, email: data.email, password: "" });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({
        type: "danger",
        text:
          error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!ok) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/api/users/profile`, config);
      localStorage.removeItem("token");
      clearStoredDisplayName();
      setIsAuthenticated?.(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setMessage({
        type: "danger",
        text: "Failed to delete account. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="section">
        <div className="container">
          <p className="has-text-centered">Loading profile…</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <h1 className="title has-text-centered">My profile</h1>

            {message.text && (
              <div
                className={`notification is-${message.type} is-light`}
                role={message.type === "danger" ? "alert" : "status"}
              >
                <button
                  type="button"
                  className="delete"
                  aria-label="Dismiss message"
                  onClick={() => setMessage({ type: "", text: "" })}
                />
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="box">
              <div className="field">
                <label className="label" htmlFor="profile-name">
                  Name
                </label>
                <div className="control">
                  <input
                    id="profile-name"
                    className="input"
                    type="text"
                    value={userData.name}
                    onChange={(e) =>
                      setUserData({ ...userData, name: e.target.value })
                    }
                    disabled={!isEditing}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="profile-email">
                  Email
                </label>
                <div className="control">
                  <input
                    id="profile-email"
                    className="input"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label" htmlFor="profile-password">
                  New password
                </label>
                <div className="field has-addons">
                  <div className="control is-expanded">
                    <input
                      id="profile-password"
                      className="input"
                      type={showPassword ? "text" : "password"}
                      placeholder={
                        isEditing ? "Leave blank to keep current password" : ""
                      }
                      value={userData.password}
                      onChange={(e) =>
                        setUserData({ ...userData, password: e.target.value })
                      }
                      disabled={!isEditing}
                      autoComplete="new-password"
                      aria-describedby="profile-password-help"
                    />
                  </div>
                  {isEditing && (
                    <div className="control">
                      <button
                        type="button"
                        className="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                      >
                        <span className="icon is-small" aria-hidden="true">
                          <i
                            className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                          />
                        </span>
                      </button>
                    </div>
                  )}
                </div>
                <p id="profile-password-help" className="help">
                  {isEditing
                    ? "Only fill this field if you want to change your password."
                    : "Password is not shown. Choose Edit profile to change it."}
                </p>
              </div>

              <div className="buttons is-centered mt-4">
                {isEditing ? (
                  <>
                    <button type="submit" className="button is-primary">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="button is-light"
                      onClick={() => {
                        if (editSnapshot.current) {
                          setUserData({ ...editSnapshot.current, password: "" });
                          editSnapshot.current = null;
                        }
                        setIsEditing(false);
                        setShowPassword(false);
                        setMessage({ type: "", text: "" });
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="button is-link"
                    onClick={() => {
                      editSnapshot.current = { ...userData, password: "" };
                      setIsEditing(true);
                    }}
                  >
                    Edit profile
                  </button>
                )}
              </div>
            </form>

            <div className="box profile-danger-zone">
              <h2 className="title is-6 has-text-danger">Danger zone</h2>
              <p className="is-size-7 mb-3">
                Deleting your account removes your profile permanently.
              </p>
              <button
                type="button"
                className="button is-danger is-outlined"
                onClick={handleDeleteAccount}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
