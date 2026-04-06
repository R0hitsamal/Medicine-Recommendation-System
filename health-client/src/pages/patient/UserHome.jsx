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

const Dashboard = ({ messages = [] }) => {
  const [profileStatus, setProfileStatus] = useState("");
  const [doctorCount, setDoctorCount] = useState(0);
  const [drugCount, setDrugCount] = useState(0);
  const [diagnosisCount, setDiagnosisCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [diagnoses, setDiagnoses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile data
        // const userDoc = await getDoc(doc(db, "users", user.uid));
        // if (userDoc.exists()) {
        //   setUserData(userDoc.data());
        // }

        // Fetch user's diagnoses
        const diagnosesQuery = query(
          collection(db, "diagnoses"),
          where("uid", "==", user.uid)
        );
        const diagnosesSnapshot = await getDocs(diagnosesQuery);
        const userDiagnoses = [];

        diagnosesSnapshot.forEach((doc) => {
          userDiagnoses.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Sort by timestamp (newest first)
        userDiagnoses.sort(
          (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
        );
        setDiagnoses(userDiagnoses);

        // Fetch available doctors
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );
        const doctorsSnapshot = await getDocs(doctorsQuery);
        const availableDoctors = [];

        doctorsSnapshot.forEach((doc) => {
          availableDoctors.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }
        console.log("Fetching data for user:", user.uid);
        // Check profile status
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.profileCreated === false) {
            setProfileStatus("Please Create Profile To Continue");
          }
        }

        // Count doctors
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );
        const doctorsSnapshot = await getDocs(doctorsQuery);
        setDoctorCount(doctorsSnapshot.size);

        // Fetch all diagnoses for the user
        const diagonosisQuery = query(
          collection(db, "diagnoses"),
          where("uid", "==", user.uid)
        );
        const diagonosisSnapshot = await getDocs(diagonosisQuery);

        // Initialize counters
        let drugRecommendations = 0;
        let totalDiagnoses = 0;
        let appointments = 0;
        console.log("Number of documents:", diagonosisSnapshot.size);

        diagonosisSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(data);
          totalDiagnoses++; // Count all diagnoses

          console.log(data);
          // Count drug recommendations
          if (data.recomendation === true) {
            drugRecommendations++;
          }

          // Count appointments
          if (data.appointmentRequested === true) {
            appointments++;
          }
        });

        // Set the counts
        setDrugCount(drugRecommendations);
        setDiagnosisCount(totalDiagnoses);
        setAppointmentCount(appointments);
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
      <Container fluid>
        <Alert variant="info">Loading data...</Alert>
      </Container>
    );
  }

  return (
    <div id="content-wrapper">
      <Container fluid>
        {/* Breadcrumbs */}
        <Breadcrumb>
          <Breadcrumb.Item
            linkAs={Link}
            linkProps={{ to: "/patient-dashboard" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Overview</Breadcrumb.Item>
        </Breadcrumb>

        {/* Profile Status Alert */}
        {profileStatus && (
          <Alert variant="danger" className="mb-4">
            {profileStatus}
          </Alert>
        )}

        {/* All Cards */}
        <Row>
          {/* Drug Recommended Card */}
          <Col xl={3} sm={6} className="mb-3">
            <Card className="text-white bg-success h-100">
              <Card.Body>
                <div className="card-body-icon">
                  <FaCapsules size="2em" />
                </div>
                <div className="mr-5">{drugCount}</div>
              </Card.Body>
              <Card.Footer className="text-white clearfix small z-1">
                <Link to="/drugs" className="text-white">
                  <span className="float-left">Total Drug Recommended</span>
                  <br />
                  <span className="float-left">More Info</span>
                  <span className="float-right">
                    <FaAngleRight />
                  </span>
                </Link>
              </Card.Footer>
            </Card>
          </Col>

          {/* Diagnosis Card */}
          <Col xl={3} sm={6} className="mb-3">
            <Card className="text-white bg-primary h-100">
              <Card.Body>
                <div className="card-body-icon">
                  <FaDiagnoses size="2em" />
                </div>
                <div className="mr-5">{diagnoses.length}</div>
              </Card.Body>
              <Card.Footer className="text-white clearfix small z-1">
                <Link to="/diagnosis" className="text-white">
                  <span className="float-left">Total Diagnosis</span>
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
                <div className="mr-5">{appointmentCount}</div>
              </Card.Body>
              <Card.Footer className="text-white clearfix small z-1">
                <Link to="/appointments" className="text-white">
                  <span className="float-left">Appointments Made</span>
                  <br />
                  <span className="float-left">More Info</span>
                  <span className="float-right">
                    <FaAngleRight />
                  </span>
                </Link>
              </Card.Footer>
            </Card>
          </Col>

          {/* Doctors Card */}
          <Col xl={3} sm={6} className="mb-3">
            <Card className="text-white bg-danger h-100">
              <Card.Body>
                <div className="card-body-icon">
                  <FaUserMd size="2em" />
                </div>
                <div className="mr-5">{doctorCount}</div>
              </Card.Body>
              <Card.Footer className="text-white clearfix small z-1">
                <Link to="/doctors" className="text-white">
                  <span className="float-left">Total Doctors</span>
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

        {/* Messages */}
        {messages.length > 0 && (
          <div className="messages">
            {messages.map((message, index) => (
              <Alert key={index} variant="success" style={{ color: "green" }}>
                {message}
              </Alert>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
