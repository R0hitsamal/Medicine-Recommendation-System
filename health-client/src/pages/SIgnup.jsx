import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app } from "../config/firebase"; // Adjust path as needed
import Header from "./components/Home/Header";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessages([]);

    try {
      const { email, password, username } = formData;

      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Store additional info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        role: "patient",
        uid: user.uid,
        profileCreated: false,
        createdAt: new Date(),
      });

      setMessages(["Registration successful!"]);
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error);
      setMessages([error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <Header />
      <div className="row">
        <div className="col-sm-4"></div>

        <div className="col-sm-4" style={{ paddingTop: "20px" }}>
          <div
            className="card body"
            style={{
              paddingBottom: "70px",
              paddingLeft: "20px",
              paddingRight: "20px",
              paddingTop: "20px",
            }}
            id="login_card"
          >
            <h4 className="text-center alert alert-info">Registration Form</h4>

            <div className="reg_form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="col-form-label">Username</label>
                  <div className="row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        placeholder="Enter Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-form-label">Email</label>
                  <div className="row">
                    <div className="col">
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Enter Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="col-form-label">Password</label>
                  <div className="row">
                    <div className="col">
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        placeholder="Enter Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>


                <button
                  type="submit"
                  id="reg_btn"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>

                <br />
                <br />

                <div className="form-group">
                  {messages.length > 0 && (
                    <div className="messages">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`alert ${
                            message.includes("success")
                              ? "alert-success"
                              : "alert-danger"
                          }`}
                          style={{
                            color: message.includes("success")
                              ? "green"
                              : "red",
                          }}
                        >
                          {message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4"></div>
      </div>
    </div>
  );
};

export default Signup;
