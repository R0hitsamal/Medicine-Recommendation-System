// src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer-area area-padding-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-2 col-sm-6 single-footer-widget">
            <h4>Top Products</h4>
            <ul>
              <li>
                <Link to="#">Managed Website</Link>
              </li>
              <li>
                <Link to="#">Manage Reputation</Link>
              </li>
              <li>
                <Link to="#">Power Tools</Link>
              </li>
              <li>
                <Link to="#">Marketing Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-sm-6 single-footer-widget">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="#">Jobs</Link>
              </li>
              <li>
                <Link to="#">Brand Assets</Link>
              </li>
              <li>
                <Link to="#">Investor Relations</Link>
              </li>
              <li>
                <Link to="#">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-sm-6 single-footer-widget">
            <h4>Features</h4>
            <ul>
              <li>
                <Link to="#">Jobs</Link>
              </li>
              <li>
                <Link to="#">Brand Assets</Link>
              </li>
              <li>
                <Link to="#">Investor Relations</Link>
              </li>
              <li>
                <Link to="#">Terms of Service</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-sm-6 single-footer-widget">
            <h4>Resources</h4>
            <ul>
              <li>
                <Link to="#">Guides</Link>
              </li>
              <li>
                <Link to="#">Research</Link>
              </li>
              <li>
                <Link to="#">Experts</Link>
              </li>
              <li>
                <Link to="#">Agencies</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 single-footer-widget">
            <h4>Newsletter</h4>
            <p>You can trust us. we only send promo offers,</p>
            <div className="form-wrap" id="mc_embed_signup">
              <form
                target="_blank"
                action="https://spondonit.us12.list-manage.com/subscribe/post?u=1462626880ade1ac87bd9c93a&amp;id=92a4423d01"
                method="get"
                className="form-inline"
              >
                <input
                  className="form-control"
                  name="EMAIL"
                  placeholder="Your Email Address"
                  onFocus={(e) => (e.target.placeholder = "")}
                  onBlur={(e) => (e.target.placeholder = "Your Email Address")}
                  required=""
                  type="email"
                />
                <button className="click-btn btn btn-default">
                  <i className="ti-arrow-right"></i>
                </button>
                <div style={{ position: "absolute", left: "-5000px" }}>
                  <input
                    name="b_36c4fd991d266f23781ded980_aefe40901a"
                    tabIndex="-1"
                    value=""
                    type="text"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="row footer-bottom d-flex justify-content-between">
          <p className="col-lg-8 col-sm-12 footer-text m-0">
            Copyright &copy;{new Date().getFullYear()} All rights reserved{" "}
            <i className="" aria-hidden="true"></i> by{" "}
            <a
              href="https://colorlib.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              TeckSky
            </a>
          </p>
          <div className="col-lg-4 col-sm-12 footer-social">
            <a href="/">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="/">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="/">
              <i className="fab fa-dribbble"></i>
            </a>
            <a href="/">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
