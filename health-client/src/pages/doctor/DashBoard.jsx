import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Breadcrumb, Alert } from "react-bootstrap";
import {
  FaCapsules,
  FaDiagnoses,
  FaBookMedical,
  FaUserMd,
  FaAngleRight,
} from "react-icons/fa";
import { auth, db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Header from "../components/Doctor/Header";
import Sidebar from "../components/Doctor/Sidebar";
import { Box, CssBaseline } from "@mui/material";

const DoctorDashboard = ({ messages = [] }) => {
  const [profileStatus, setProfileStatus] = useState("");
  const [userData, setUserData] = useState(null);
  const [counts, setCounts] = useState({
    drugs: 0,
    patients: 0,
    appointments: 0,
    doctors: 0,
    predictions: 0, // Added predictions count
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          if (data.profileCreated === false) {
            setProfileStatus("Please Create Profile To Continue");
          }
        }

        // Count predictions (diagnoses made by this doctor)
        const predictionsQuery = query(
          collection(db, "diagnoses"),
          where("requestedDoctor.id", "==", user.uid)
        );
        const predictionsSnapshot = await getDocs(predictionsQuery);

        // Count patients (unique patients this doctor has diagnosed)
        const patientIds = new Set();
        let drugRecommendations = 0;

        predictionsSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.uid) patientIds.add(data.uid);
          if (data.recomendation === true) drugRecommendations++;
        });

        // Count appointments
        const appointmentsQuery = query(
          collection(db, "diagnoses"),
          where("requestedDoctor.id", "==", user.uid),
          where("appointmentRequested", "==", true)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        // Count other doctors
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );
        const doctorsSnapshot = await getDocs(doctorsQuery);

        setCounts({
          drugs: drugRecommendations,
          patients: patientIds.size,
          appointments: appointmentsSnapshot.size,
          doctors: doctorsSnapshot.size - 1, // Exclude current doctor
          predictions: predictionsSnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Header />
        <Sidebar open={true} width={240} userData={userData} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: "64px" }}>
          <Container fluid>
            <Alert variant="info">Loading dashboard data...</Alert>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header />
      <Sidebar open={true} width={240} userData={userData} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - 240px)`,
          marginTop: "64px",
        }}
      >
        <Container fluid>
          <Breadcrumb>
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: "/doctor-dashboard" }}
            >
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Overview</Breadcrumb.Item>
          </Breadcrumb>

          <Row>
            {/* Predictions Card (New) */}
            <Col xl={3} sm={6} className="mb-3">
              <Card className="text-white bg-info h-100">
                <Card.Body>
                  <div className="card-body-icon">
                    <FaDiagnoses size="2em" />
                  </div>
                  <div className="mr-5">{counts.predictions}</div>
                </Card.Body>
                <Card.Footer className="text-white clearfix small z-1">
                  <Link to="/predictions" className="text-white">
                    <span className="float-left">Total Predictions</span>
                    <br />
                    <span className="float-left">More Info</span>
                    <span className="float-right">
                      <FaAngleRight />
                    </span>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>

            {/* Drug Recommended Card */}
            <Col xl={3} sm={6} className="mb-3">
              <Card className="text-white bg-success h-100">
                <Card.Body>
                  <div className="card-body-icon">
                    <FaCapsules size="2em" />
                  </div>
                  <div className="mr-5">{counts.drugs}</div>
                </Card.Body>
                <Card.Footer className="text-white clearfix small z-1">
                  <Link to="/drugs" className="text-white">
                    <span className="float-left">Drugs Recommended</span>
                    <br />
                    <span className="float-left">More Info</span>
                    <span className="float-right">
                      <FaAngleRight />
                    </span>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>

            {/* Patients Card */}
            <Col xl={3} sm={6} className="mb-3">
              <Card className="text-white bg-primary h-100">
                <Card.Body>
                  <div className="card-body-icon">
                    <FaUserMd size="2em" />
                  </div>
                  <div className="mr-5">{counts.patients}</div>
                </Card.Body>
                <Card.Footer className="text-white clearfix small z-1">
                  <Link to="/patients" className="text-white">
                    <span className="float-left">Unique Patients</span>
                    <br />
                    <span className="float-left">More Info</span>
                    <span className="float-right">
                      <FaAngleRight />
                    </span>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>

            {/* Appointments Card */}
            <Col xl={3} sm={6} className="mb-3">
              <Card className="text-white bg-warning h-100">
                <Card.Body>
                  <div className="card-body-icon">
                    <FaBookMedical size="2em" />
                  </div>
                  <div className="mr-5">{counts.appointments}</div>
                </Card.Body>
                <Card.Footer className="text-white clearfix small z-1">
                  <Link to="/appointments" className="text-white">
                    <span className="float-left">Appointments</span>
                    <br />
                    <span className="float-left">More Info</span>
                    <span className="float-right">
                      <FaAngleRight />
                    </span>
                  </Link>
                </Card.Footer>
              </Card>
            </Col>
          </Row>

          {profileStatus && (
            <Alert variant="warning" className="mt-3">
              {profileStatus}
            </Alert>
          )}

          {messages.length > 0 && (
            <div className="messages mt-3">
              {messages.map((message, index) => (
                <Alert key={index} variant="success">
                  {message}
                </Alert>
              ))}
            </div>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
