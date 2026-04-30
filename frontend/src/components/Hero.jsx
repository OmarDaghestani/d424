import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      className="hero is-fullheight-with-navbar"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="techhub-hero-bg" aria-hidden="true" />

      <div className="hero-body techhub-hero-body-inner">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-8 has-text-centered">
              <h1 className="title is-1 has-text-white mb-6 techhub-hero-title">
                Build Your Dream PC
              </h1>
              <h2 className="subtitle is-3 has-text-white mb-6 techhub-hero-subtitle">
                Premium Components. Expert Support. Unbeatable Prices.
              </h2>
              <div className="buttons is-centered mt-6 is-flex-wrap is-justify-content-center">
                <Link
                  to="/products"
                  className="button is-primary is-large has-text-weight-bold techhub-hero-cta"
                >
                  <span>Shop now</span>
                  <span className="icon ml-2" aria-hidden="true">
                    <i className="fas fa-arrow-right"></i>
                  </span>
                </Link>
                <Link
                  to="/signup"
                  className="button is-large is-light techhub-hero-cta-secondary"
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
