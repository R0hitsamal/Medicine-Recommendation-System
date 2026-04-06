import React from "react";
import { Link } from "react-router-dom";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";

const Home = () => {
  return (
    <div>
      {/*================Header Menu Area =================*/}
      <Header />

      {/*================About Area =================*/}
      <section className="about-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-10 offset-md-1 col-lg-6 offset-lg-6 offset-xl-7 col-xl-5">
              <div className="about-content">
                <h4>
                  Get expert advice
                  <br />
                  Schedule an appointment today and take charge of your health
                  <br />
                </h4>
                <h6>
                  Give their their without moving were stars called so divide in
                  female be moving night may fish him
                </h6>
                <p>
                  The human body is a complex and amazing creation, composed of
                  trillions of cells working together to maintain health and
                  function. This section explores the different components and
                  systems that make up the human body
                </p>
                <Link className="link_one" to="#">
                  learn more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*================ Team section start =================*/}
      <section className="team-area area-padding">
        <div className="container">
          <div className="area-heading row">
            <div className="col-md-5 col-xl-4">
              <h3>
                Medcare
                <br />
                Experience Doctors
              </h3>
            </div>
            <div className="col-md-7 col-xl-8">
              <p>
                Land meat winged called subdue without very light in all years
                sea appear midst forth image him third there set. Land meat
                winged called subdue without very light in all years sea appear
              </p>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-team">
                <img
                  className="card-img rounded-0"
                  src="/assets/1.jpg"
                  alt=""
                />
                <div className="card-team__body text-center">
                  <h3>
                    <Link to="#">Dr Adity birla</Link>
                  </h3>
                  <p>Cardiologist</p>
                  <div className="team-footer d-flex justify-content-between">
                    <Link className="dn_btn" to="">
                      <i className="ti-mobile"></i>+91 7834902980
                    </Link>
                    <ul className="card-team__social">
                      <li>
                        <Link to="#">
                          <i className="ti-facebook"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-twitter-alt"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-skype"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-team">
                <img
                  className="card-img rounded-0"
                  src="/assets/3.jpg"
                  alt=""
                />
                <div className="card-team__body text-center">
                  <h3>
                    <Link to="#">Dr Biswanath Sarangi</Link>
                  </h3>
                  <p>Cardiologist</p>
                  <div className="team-footer d-flex justify-content-between">
                    <Link className="dn_btn" to="">
                      <i className="ti-mobile"></i>+91 6557892345
                    </Link>
                    <ul className="card-team__social">
                      <li>
                        <Link to="#">
                          <i className="ti-facebook"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-twitter-alt"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-skype"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="card card-team">
                <img
                  className="card-img rounded-0"
                  src="/assets/2.jpg"
                  alt=""
                />
                <div className="card-team__body text-center">
                  <h3>
                    <Link to="#">Dr Dinesh patra</Link>
                  </h3>
                  <p>Cardiologist</p>
                  <div className="team-footer d-flex justify-content-between">
                    <Link className="dn_btn" to="">
                      <i className="ti-mobile"></i>+91 814887320
                    </Link>
                    <ul className="card-team__social">
                      <li>
                        <Link to="#">
                          <i className="ti-facebook"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-twitter-alt"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          <i className="ti-skype"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*================ Team section end =================*/}

      {/* start footer Area */}
      <Footer />
    </div>
  );
};

export default Home;
