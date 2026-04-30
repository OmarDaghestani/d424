import React, { useEffect } from "react";
import Hero from "../components/Hero";
import HomeSections from "../components/HomeSections";

const HomePage = () => {
  useEffect(() => {
    document.title = "TechHub";
  }, []);

  return (
    <div className="homepage">
      <Hero />
      <HomeSections />
    </div>
  );
};

export default HomePage;
