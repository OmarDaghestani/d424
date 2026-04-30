import { useState } from "react";
import PropTypes from "prop-types";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

const SearchFilter = ({
  onSearch,
  onCategoryChange,
  onSortChange,
  category,
  sortBy,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebouncedCallback((term) => {
    onSearch(term);
  }, 300);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  return (
    <div className="filter-section">
      <div className="columns is-multiline is-mobile">
        <div className="column is-12-mobile is-6-tablet is-4-desktop">
          <div className="field">
            <label className="is-sr-only" htmlFor="product-search">
              Search products
            </label>
            <div className="control has-icons-left">
              <input
                id="product-search"
                className="input"
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              <span className="icon is-left" aria-hidden="true">
                <i className="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="column is-12-mobile is-6-tablet is-4-desktop">
          <div className="field">
            <label className="is-sr-only" htmlFor="product-category">
              Category
            </label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="product-category"
                  value={category}
                  onChange={(e) => onCategoryChange(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="CPU">CPUs</option>
                  <option value="GPU">Graphics Cards</option>
                  <option value="RAM">Memory</option>
                  <option value="Storage">Storage</option>
                  <option value="Motherboard">Motherboards</option>
                  <option value="PSU">Power Supplies</option>
                  <option value="Case">Cases</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="column is-12-mobile is-6-tablet is-4-desktop">
          <div className="field">
            <label className="is-sr-only" htmlFor="product-sort">
              Sort by
            </label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  <option value="">Sort By</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  category: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
};

export default SearchFilter;
