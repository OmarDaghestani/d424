import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductPage from "./pages/ProductPage";
import OrderPage from "./pages/OrderPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import PlaceholderPage from "./pages/PlaceholderPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/signup"
            element={<SignupPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/profile"
            element={
              <ProfilePage setIsAuthenticated={setIsAuthenticated} />
            }
          />
          <Route path="/orders" element={<OrderPage />} />
          <Route
            path="/about"
            element={
              <PlaceholderPage
                title="About TechHub"
                description="We are an independent PC parts retailer focused on clarity, accurate specifications, and a smooth path from browse to order."
                points={[
                  "Transparent stock and pricing on every listing.",
                  "Categories spanning CPUs, GPUs, memory, storage, boards, power, and cases.",
                  "Account hub for profile details and order history in one place.",
                ]}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <PlaceholderPage
                title="Contact us"
                description="We are expanding direct support channels. For now, create an account to place orders and track them from your dashboard."
                points={[
                  "Order questions: sign in and open Orders from the account menu.",
                  "Product availability is shown on each product page.",
                  "This page will soon list email and phone options for sales and support.",
                ]}
              />
            }
          />
          <Route
            path="/faq"
            element={
              <PlaceholderPage
                title="Frequently asked questions"
                description="Quick answers about shopping, accounts, and orders on TechHub."
                points={[
                  "Do I need an account to order? Yes—sign up or log in so we can tie orders to your profile.",
                  "How do I track an order? Use Orders in the top-right account menu after signing in.",
                  "Are specifications accurate? We display structured specs per category; always verify compatibility for your build.",
                  "What if an item is out of stock? The product page shows stock status and the order button is disabled when unavailable.",
                ]}
              />
            }
          />
          <Route
            path="/shipping"
            element={
              <PlaceholderPage
                title="Shipping"
                description="Shipping policies and carriers will be published here as we scale fulfillment partners."
                points={[
                  "Standard processing: orders move to fulfillment after payment confirmation.",
                  "Tracking: you will receive tracking details by email once this integration is live.",
                  "International: rates and customs guidance will be added to this page.",
                ]}
              />
            }
          />
          <Route
            path="/returns"
            element={
              <PlaceholderPage
                title="Returns & exchanges"
                description="Our goal is a fair, predictable return window for unopened and defective hardware."
                points={[
                  "Unopened items: return window and restocking details will be listed here.",
                  "Defective on arrival: contact support with your order ID and photos where applicable.",
                  "Change of mind: policies may vary by category; final terms will appear on this page.",
                ]}
              />
            }
          />
          <Route
            path="/privacy"
            element={
              <PlaceholderPage
                title="Privacy policy"
                description="We respect your data. This policy will describe what we collect, why we collect it, and your choices."
                points={[
                  "Account data: name and email are used for authentication and order communication.",
                  "Orders: we retain order history so you can review purchases in your account.",
                  "Cookies: we use session storage for your login token; no third-party ad trackers are required to shop.",
                ]}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
