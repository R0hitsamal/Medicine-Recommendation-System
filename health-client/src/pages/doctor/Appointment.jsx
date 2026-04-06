import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Alert,
  Breadcrumb,
  Container,
  Row,
  Col,
  Badge,
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
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Header from "../components/Doctor/Header";
import Sidebar from "../components/Doctor/Sidebar";

const AppointmentPanel = () => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch pending appointments data
        const appointmentsQuery = query(
          collection(db, "diagnoses"),
          where("appointmentRequested", "==", true),
          where("appointmentStatus", "==", "pending")
        );

        const querySnapshot = await getDocs(appointmentsQuery);
        const appointmentsData = [];

        querySnapshot.forEach((doc) => {
          appointmentsData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load appointments");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApproveClick = (appointment) => {
    setCurrentAppointment(appointment);
    setShowModal(true);
  };

  const handleApproveAppointment = async () => {
    if (!currentAppointment) return;

    try {
      const appointmentRef = doc(db, "diagnoses", currentAppointment.id);
      await updateDoc(appointmentRef, {
        appointmentStatus: "approved",
        approvedDate: new Date(),
      });

      // Update local state
      setAppointments(
        appointments.map((a) =>
          a.id === currentAppointment.id
            ? {
                ...a,
                appointmentStatus: "approved",
                approvedDate: new Date(),
              }
            : a
        )
      );

      setShowModal(false);
      setSuccess("Appointment approved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error approving appointment:", error);
      setError("Failed to approve appointment");
      setTimeout(() => setError(null), 3000);
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
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Appointment Panel</Breadcrumb.Item>
          </Breadcrumb>

          {/* Alerts */}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {/* Main Content Area */}
          <Row>
            <Col md={12}>
              <h4 className="text-center alert alert-info">
                Pending Appointment Requests
              </h4>

              {appointments.length === 0 ? (
                <Alert variant="info">No pending appointments found</Alert>
              ) : (
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Condition</th>
                      <th>Request Date</th>
                      <th>Preferred Date/Time</th>
                      <th>Notes</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>
                          {appointment.patientName ||
                            appointment.email ||
                            "N/A"}
                        </td>
                        <td>{appointment.predictedDisease || "N/A"}</td>
                        <td>
                          {appointment.appointmentRequestDate
                            ?.toDate()
                            .toLocaleString() || "N/A"}
                        </td>
                        <td>
                          {appointment.preferredDate}{" "}
                          {appointment.preferredTime}
                        </td>
                        <td>
                          {appointment.appointmentNotes || "No notes provided"}
                        </td>
                        <td>
                          <Badge
                            bg={
                              appointment.appointmentStatus === "pending"
                                ? "warning"
                                : appointment.appointmentStatus === "approved"
                                ? "success"
                                : "danger"
                            }
                          >
                            {appointment.appointmentStatus}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleApproveClick(appointment)}
                            disabled={
                              appointment.appointmentStatus !== "pending"
                            }
                          >
                            Approve
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Approval Confirmation Modal */}
              <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>
                    Are you sure you want to approve this appointment request?
                  </p>
                  {currentAppointment && (
                    <div>
                      <p>
                        <strong>Patient:</strong>{" "}
                        {currentAppointment.patientName ||
                          currentAppointment.email ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Condition:</strong>{" "}
                        {currentAppointment.predictedDisease || "N/A"}
                      </p>
                      <p>
                        <strong>Preferred Time:</strong>{" "}
                        {currentAppointment.preferredDate}{" "}
                        {currentAppointment.preferredTime}
                      </p>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleApproveAppointment}>
                    Confirm Approval
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

export default AppointmentPanel;
