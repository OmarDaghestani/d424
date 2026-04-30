import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import SearchFilter from "./SearchFilter";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const ProductList = () => {
  useDocumentTitle("Products");

  const location = useLocation();
  const navigate = useNavigate();
  const appliedCategoryNav = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchFilterKey, setSearchFilterKey] = useState(0);

  const formatSpecifications = (specs) => {
    if (!specs) return {};
    return specs instanceof Map ? Object.fromEntries(specs) : specs;
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!products.length || appliedCategoryNav.current) return;
    const cat = location.state?.categoryFilter;
    if (!cat || typeof cat !== "string") return;

    appliedCategoryNav.current = true;
    setSelectedCategory(cat);
    setSearchTerm("");
    setSortBy("");
    setSearchFilterKey((k) => k + 1);
    setFilteredProducts(products.filter((p) => p.category === cat));
    navigate(".", { replace: true, state: {} });
  }, [products, location.state, navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      const formattedData = data.map((product) => ({
        ...product,
        specifications: formatSpecifications(product.specifications),
      }));
      setProducts(formattedData);
      setFilteredProducts(formattedData);
    } catch (err) {
      setError("Failed to load products. Please try again later.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (search, category, sort) => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (sort) {
      switch (sort) {
        case "price-asc":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          break;
      }
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(term, selectedCategory, sortBy);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterProducts(searchTerm, category, sortBy);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    filterProducts(searchTerm, selectedCategory, sortOption);
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Shop components</h1>
          <p className="subtitle mb-5 techhub-page-lead">
            Browse CPUs, GPUs, memory, and more.
          </p>
          <div className="columns is-multiline techhub-skeleton-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="column is-3-desktop is-4-tablet is-6-mobile"
              >
                <div className="techhub-skeleton-card" aria-hidden="true" />
              </div>
            ))}
          </div>
          <p className="has-text-centered techhub-readable-muted mt-4">
            Loading products…
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title">Shop components</h1>
          <div className="notification is-danger" role="alert">
            {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Shop components</h1>
        <p className="subtitle mb-5 techhub-page-lead">
          {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""} shown
        </p>

        <SearchFilter
          key={searchFilterKey}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          category={selectedCategory}
          sortBy={sortBy}
        />

        {filteredProducts.length === 0 ? (
          <div className="has-text-centered mt-6">
            <p className="is-size-5 mb-4">
              No products found matching your criteria.
            </p>
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setSortBy("");
                setFilteredProducts(products);
                setSearchFilterKey((k) => k + 1);
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="columns is-multiline mt-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;
