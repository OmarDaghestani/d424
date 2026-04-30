import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom"; // Mock routing
import axios from "axios";
import LoginPage from "../src/pages/LoginPage.jsx";

jest.mock("axios"); // Mock Axios

describe("LoginPage Component", () => {
  let setIsAuthenticatedMock;

  beforeEach(() => {
    setIsAuthenticatedMock = jest.fn();
    render(
      <Router>
        <LoginPage setIsAuthenticated={setIsAuthenticatedMock} />
      </Router>
    );
  });

  it("renders the login form", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("updates input values when typed into", () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("disables the login button if inputs are empty", () => {
    const loginButton = screen.getByRole("button", { name: /log in/i });
    expect(loginButton).toBeDisabled();
  });

  it("enables the login button when inputs are filled", () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(loginButton).not.toBeDisabled();
  });

  it("displays an error message if login fails", async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

    axios.post.mockRejectedValue({
      response: { data: { message: "Invalid email or password" } },
    });

    fireEvent.click(loginButton);

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage).toHaveTextContent("Invalid email or password");
  });

  it("stores token and redirects on successful login", async () => {
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    axios.post.mockResolvedValue({
      data: { token: "mockToken" },
    });

    fireEvent.click(loginButton);

    expect(await axios.post).toHaveBeenCalledWith(
      `${process.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
      { email: "test@example.com", password: "password123" }
    );

    expect(setIsAuthenticatedMock).toHaveBeenCalledWith(true);
    expect(localStorage.getItem("token")).toBe("mockToken");
  });
});
