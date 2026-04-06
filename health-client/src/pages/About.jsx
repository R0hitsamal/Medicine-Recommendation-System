// src/pages/About.js
import React from "react";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
      <Header />
      {/* Banner Area */}
      <section className="banner_area">
        <div className="banner_inner d-flex align-items-center">
          <div className="container">
            <div className="banner_content d-md-flex justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                <h2>About Us</h2>
                <p>Belding years moveth earth green behold wherein</p>
              </div>
              <div className="page_link">
                <Link to="/">Home</Link>
                <Link to="/about">About Us</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Area */}
      <section className="about-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10 offset-md-1 col-lg-6 offset-lg-6 offset-xl-7 col-xl-5">
              <div className="about-content">
                <h4>
                  Second Abundantly
                  <br />
                  Move That Cattle Perform
                  <br />
                  Appen Land
                </h4>
                <h6>
                  Give their their without moving were stars called so divide in
                  female be moving night may fish him
                </h6>
                <p>
                  Give their their without moving were stars called so divide
                  female be moving night may fish him own male vreated great
                  Give their their without moving were. Stars called so divide
                  female moving night may fish him own male created great
                  opportunity deal.
                </p>
                <a className="link_one" href="#">
                  learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutPage;
