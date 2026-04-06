import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../config/firebase"; // Adjust path as needed
import Header from "./components/Home/Header";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
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
      // Using username as email (adjust if your auth is different)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.username, // Using username as email
        formData.password
      );
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        setMessages(["Login successful!"]);

        // Redirect based on role
        if (role === "doctor") {
          navigate("/doctor-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        setMessages(["User data not found in Firestore."]);
      }
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
            <h4 className="text-center alert alert-info">Login Form</h4>

            <div className="login_form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="col-form-label">Email</label>
                  <div className="row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        id="org"
                        placeholder="Enter Email"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        name="username"
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
                        id="org"
                        placeholder="Enter Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        name="password"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  id="login_btn"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>

                <br />
                <br />

                <div className="form-group">
                  {messages.length > 0 && (
                    <div className="messages">
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className="alert alert-success"
                          style={{ color: "red" }} // Matches your template's error color
                        >
                          {message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register">Register here</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-4"></div>
      </div>
    </div>
  );
};

export default LoginForm;
