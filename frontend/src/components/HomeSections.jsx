import { Link } from "react-router-dom";

const categories = [
  { label: "CPUs", filter: "CPU", icon: "fa-microchip", hint: "Latest AMD & Intel" },
  { label: "GPUs", filter: "GPU", icon: "fa-tv", hint: "4K-ready graphics" },
  { label: "Memory", filter: "RAM", icon: "fa-memory", hint: "DDR5 kits" },
  { label: "Storage", filter: "Storage", icon: "fa-hdd", hint: "NVMe SSDs" },
  {
    label: "Motherboards",
    filter: "Motherboard",
    icon: "fa-server",
    hint: "All chipsets",
  },
  {
    label: "Power & cases",
    filter: null,
    icon: "fa-bolt",
    hint: "PSUs, cases & cooling",
  },
];

const HomeSections = () => {
  return (
    <>
      <section className="section techhub-home-band techhub-home-band--muted">
        <div className="container">
          <h2 className="title is-3 has-text-centered mb-2">
            Why builders choose TechHub
          </h2>
          <p className="subtitle has-text-centered mb-6 techhub-home-lead">
            Curated hardware, clear specs, and a catalog designed so you spend
            less time comparing and more time building.
          </p>
          <div className="columns is-multiline">
            <div className="column is-4">
              <div className="box techhub-home-card">
                <span className="icon is-large has-text-primary mb-3">
                  <i className="fas fa-shield-alt fa-2x" aria-hidden="true" />
                </span>
                <h3 className="title is-5">Verified listings</h3>
                <p>
                  Every product shows real specifications—cores, clocks, form
                  factors—so you know exactly what is in the box.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box techhub-home-card">
                <span className="icon is-large has-text-primary mb-3">
                  <i className="fas fa-shipping-fast fa-2x" aria-hidden="true" />
                </span>
                <h3 className="title is-5">Ready when you are</h3>
                <p>
                  Stock levels are shown up front. Low-stock warnings help you
                  decide before checkout—no surprises at the cart.
                </p>
              </div>
            </div>
            <div className="column is-4">
              <div className="box techhub-home-card">
                <span className="icon is-large has-text-primary mb-3">
                  <i className="fas fa-headset fa-2x" aria-hidden="true" />
                </span>
                <h3 className="title is-5">Orders in one place</h3>
                <p>
                  Signed-in customers can track orders and revisit purchases
                  from the account menu—simple and centralized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section techhub-home-band">
        <div className="container">
          <div className="level is-mobile mb-5">
            <div className="level-left">
              <div className="level-item">
                <h2 className="title is-3 mb-0">Shop by category</h2>
              </div>
            </div>
            <div className="level-right">
              <Link to="/products" className="button is-primary is-outlined">
                View all products
              </Link>
            </div>
          </div>
          <div className="columns is-multiline">
            {categories.map((c) => (
              <div
                key={c.label}
                className="column is-6-tablet is-4-desktop is-6-mobile"
              >
                <Link
                  to="/products"
                  state={c.filter ? { categoryFilter: c.filter } : undefined}
                  className="box techhub-home-cat is-block"
                >
                  <div className="is-flex is-align-items-center mb-2">
                    <span className="icon has-text-primary mr-3">
                      <i className={`fas ${c.icon} fa-lg`} aria-hidden="true" />
                    </span>
                    <span className="title is-5 mb-0">{c.label}</span>
                  </div>
                  <p className="techhub-home-cat-hint mb-0">{c.hint}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section techhub-home-cta">
        <div className="container">
          <div className="box has-text-centered techhub-home-cta-inner">
            <h2 className="title is-4 has-text-white">
              Start your next build today
            </h2>
            <p className="techhub-home-cta-sub mb-5">
              Browse the full catalog, filter by category, and sort by price or
              name to find the perfect parts.
            </p>
            <div className="buttons is-centered is-flex-wrap">
              <Link
                to="/products"
                className="button is-primary is-medium has-text-weight-semibold"
              >
                Browse catalog
              </Link>
              <Link
                to="/signup"
                className="button is-white is-outlined is-medium"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeSections;
