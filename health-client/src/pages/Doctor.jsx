// src/pages/Doctors.js
import React from "react";
import { Link } from "react-router-dom";
import Header from "./components/Home/Header";
import Footer from "./components/Home/Footer";

const Doctors = () => {
  const doctors = [
    {
      id: 1,
      name: "Dr Adam Brain",
      specialty: "Cardiologist",
      image: "/assets/1.jpg",
      phone: "+7 235 365 2365",
    },
    {
      id: 2,
      name: "Dr Blian Judge",
      specialty: "Cardiologist",
      image: "/assets/2.jpg",
      phone: "+7 235 365 2365",
    },
    {
      id: 3,
      name: "Dr Blian Judge",
      specialty: "Cardiologist",
      image: "/assets/3.jpg",
      phone: "+7 235 365 2365",
    },
  ];

  return (
    <div className="doctors-page">
      <Header />

      {/* Banner Area */}
      <section className="banner_area">
        <div className="banner_inner d-flex align-items-center">
          <div className="container">
            <div className="banner_content d-md-flex justify-content-between align-items-center">
              <div className="mb-3 mb-md-0">
                <h2>Doctors</h2>
                <p>Belding years moveth earth green behold wherein</p>
              </div>
              <div className="page_link">
                <Link to="/">Home</Link>
                <Link to="/dr_list">Doctors</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Team Area */}
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
            {doctors.map((doctor) => (
              <div key={doctor.id} className="col-12 col-md-6 col-lg-4">
                <div className="card card-team">
                  <img
                    className="card-img rounded-0"
                    src={doctor.image}
                    alt={doctor.name}
                  />
                  <div className="card-team__body text-center">
                    <h3>
                      <Link to="#">{doctor.name}</Link>
                    </h3>
                    <p>{doctor.specialty}</p>
                    <div className="team-footer d-flex justify-content-between">
                      <a className="dn_btn" href={`tel:${doctor.phone}`}>
                        <i className="ti-mobile"></i>
                        {doctor.phone}
                      </a>
                      <ul className="card-team__social">
                        <li>
                          <a href="#">
                            <i className="ti-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ti-twitter-alt"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ti-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="ti-skype"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Doctors;
