import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Breadcrumb,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import Header from "../components/Doctor/Header";
import Sidebar from "../components/Doctor/Sidebar";

const DrugRecommendationPanel = () => {
  const [diseases, setDiseases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDisease, setCurrentDisease] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    try {
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch (e) {
      return "N/A";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      setUserId(user.uid);

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch diagnoses data filtered by this doctor
        const diagnosesQuery = query(
          collection(db, "diagnoses"),
          where("requestedDoctor.id", "==", user.uid)
        );
        const querySnapshot = await getDocs(diagnosesQuery);
        const diseasesData = [];

        // Collect all unique patient UIDs
        const patientUids = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.uid) patientUids.add(data.uid);
        });

        // Fetch patient profiles for missing data
        const patientProfiles = {};
        await Promise.all(
          Array.from(patientUids).map(async (uid) => {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
              patientProfiles[uid] = userDoc.data();
            }
          })
        );

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const profile = patientProfiles[data.uid] || {};
          diseasesData.push({
            id: doc.id,
            ...data,
            firstname: data.firstname || profile.firstname || "",
            lastname: data.lastname || profile.lastname || "",
            birth_date: data.birth_date || profile.birth_date || null,
          });
        });

        setDiseases(diseasesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRecommendClick = (disease) => {
    setCurrentDisease(disease);
    setFormData({
      firstName: disease.firstname || disease.patientName?.split(" ")[0] || "",
      lastName: disease.lastname || disease.patientName?.split(" ")[1] || "",
      email: disease.email || "",
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentDisease) return;

    try {
      const diseaseRef = doc(db, "diagnoses", currentDisease.id);
      await updateDoc(diseaseRef, {
        recomendation: true,
        patientName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        newRecommendation: true, // Add this flag
        recommendationDate: new Date(), // Add timestamp
        recommendedBy: userData?.username || "Doctor", // Add who made the recommendation
      });

      // Update local state
      setDiseases(
        diseases.map((d) =>
          d.id === currentDisease.id
            ? {
                ...d,
                recommendedDrug: d.recommendedDrug,
                patient: {
                  ...d.patient,
                  name: `${formData.username}`.trim(),
                  email: formData.email,
                },
                newRecommendation: true,
                recommendationDate: new Date(),
                recommendedBy: userData?.username || "Doctor",
              }
            : d
        )
      );

      setShowModal(false);
    } catch (error) {
      console.error("Error updating recommendation:", error);
      alert("Failed to save recommendation. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex" id="wrapper">
      {/* Sidebar */}
      <Sidebar open={true} width={240} userData={userData} />

      {/* Page Content */}
      <div id="page-content-wrapper">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <Container fluid className="py-4">
          {/* Breadcrumbs */}
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/doctor" }}>
              Drug Recommendation Panel
            </Breadcrumb.Item>
          </Breadcrumb>

          {/* Main Content Area */}
          <Row>
            <Col md={12}>
              <h4 className="text-center alert alert-info">
                List Of Disease Diagnosed
              </h4>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>Email</th>
                    <th>Disease</th>
                    <th>Medicine</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <input type="hidden" value={userId} id="user_id" />
                  {diseases.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>
                        {d.firstname && d.lastname
                          ? `${d.firstname} ${d.lastname}`
                          : d.patientName || "N/A"}
                      </td>
                      <td>{calculateAge(d.birth_date)}</td>
                      <td>{d.email || "N/A"}</td>
                      <td>{d.predictedDisease || "N/A"}</td>
                      <td>
                        {d.recommendedDrug || "Yet Recommended"}
                        {d.newRecommendation && (
                          <span className="badge bg-success ms-2">New</span>
                        )}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          className="btn_recommend"
                          onClick={() => handleRecommendClick(d)}
                        >
                          Recommend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div id="result" className="col-sm-10 offset-sm-3"></div>

              {/* Recommendation Modal */}
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title className="text-primary text-center w-100">
                    Candidate Information
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form id="contactForm">
                    <input
                      type="hidden"
                      className="sid"
                      id="bfid"
                      value={currentDisease?.id || ""}
                    />
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="bffname"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="bflname"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        id="bfemail"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button variant="success" onClick={handleSave}>
                    Save Recommendation
                  </Button>
                </Modal.Footer>
              </Modal>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DrugRecommendationPanel;
