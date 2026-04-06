import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  IconButton,
  Toolbar,
  CircularProgress,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Avatar,
  InputAdornment,
} from "@mui/material";
import {
  Home as HomeIcon,
  Close as CloseIcon,
  MedicalServices as MedicalIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
} from "@mui/icons-material";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { format } from "date-fns";

const AppointmentPanel = () => {
  const [doctorEmails, setDoctorEmails] = useState({});
  const [userData, setUserData] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // Fetch user data and diagnoses with appointment info
  useEffect(() => {
    const fetchEmails = async () => {
      const emails = {};
      const uniqueDoctorIds = [
        ...new Set(
          diagnoses
            .map((d) => d.doctor?.id)
            .filter((id) => id && !doctorEmails[id])
        ),
      ];

      await Promise.all(
        uniqueDoctorIds.map(async (doctorId) => {
          try {
            const doctorDoc = await getDoc(doc(db, "users", doctorId));
            emails[doctorId] = doctorDoc.exists()
              ? doctorDoc.data().email
              : "N/A";
          } catch (error) {
            emails[doctorId] = "Error loading email";
          }
        })
      );

      setDoctorEmails((prev) => ({ ...prev, ...emails }));
    };

    fetchEmails();
  }, [diagnoses]);

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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }

        // Fetch user's diagnoses (which contain appointment info)
        const diagnosesQuery = query(
          collection(db, "diagnoses"),
          where("uid", "==", user.uid)
        );
        const diagnosesSnapshot = await getDocs(diagnosesQuery);
        const userDiagnoses = [];

        for (const doc of diagnosesSnapshot.docs) {
          const diagnosisData = doc.data();
          let doctorData = null;

          // Enhanced doctor data fetching with error handling
          if (diagnosisData.requestedDoctor?.id) {
            try {
              const doctorDoc = await getDoc(
                doc(db, "users", diagnosisData.requestedDoctor.id)
              );
              if (doctorDoc.exists()) {
                doctorData = {
                  id: doctorDoc.id,
                  ...doctorDoc.data(),
                  // Handle different possible field names
                  name:
                    doctorDoc.data().name ||
                    `${doctorDoc.data().firstName} ${
                      doctorDoc.data().lastName
                    }`,
                  specialization:
                    doctorDoc.data().specialization ||
                    doctorDoc.data().specialty ||
                    "General Practitioner",
                };
              }
            } catch (err) {
              console.error("Error fetching doctor data:", err);
            }
          }

          userDiagnoses.push({
            id: doc.id,
            ...diagnosisData,
            timestamp: diagnosisData.timestamp?.toDate(),
            appointmentRequestDate:
              diagnosisData.appointmentRequestDate?.toDate(),
            doctor: doctorData,
            // Include all appointment-related fields
            appointmentStatus: diagnosisData.appointmentStatus || "pending",
            appointmentNotes: diagnosisData.appointmentNotes || "",
            preferredDate: diagnosisData.preferredDate || "",
            preferredTime: diagnosisData.preferredTime || "",
          });
        }

        // Sort by appointment request date (newest first)
        userDiagnoses.sort((a, b) => {
          const dateA = a.appointmentRequestDate || new Date(0);
          const dateB = b.appointmentRequestDate || new Date(0);
          return dateB - dateA;
        });

        setDiagnoses(userDiagnoses);

        // Fetch all doctors
        const doctorsQuery = query(
          collection(db, "users"),
          where("role", "==", "doctor")
        );
        const doctorsSnapshot = await getDocs(doctorsQuery);
        const doctorsList = doctorsSnapshot.docs.map((doc) => ({
          id: doc.id,
          name:
            doc.data().name || `${doc.data().firstName} ${doc.data().lastName}`,
          specialization:
            doc.data().specialization ||
            doc.data().specialty ||
            "General Practitioner",
          phoneNumber: doc.data().phoneNumber,
          email: doc.data().email,
          photoURL: doc.data().photoURL,
        }));
        setDoctors(doctorsList);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoctor("");
    setAppointmentNotes("");
  };

  const handleRequestAppointment = async () => {
    if (!selectedDoctor) return;

    try {
      const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

      // Find the most recent diagnosis without an appointment
      const recentDiagnosis = diagnoses
        .filter((d) => !d.appointmentRequested)
        .sort((a, b) => b.timestamp - a.timestamp)[0];

      if (!recentDiagnosis) {
        throw new Error("No recent diagnosis found for appointment request");
      }

      const diagnosisRef = doc(db, "diagnoses", recentDiagnosis.id);
      await updateDoc(diagnosisRef, {
        appointmentRequested: true,
        appointmentStatus: "pending",
        appointmentNotes: appointmentNotes,
        appointmentRequestDate: new Date(),
        requestedDoctor: {
          id: selectedDoctor,
          name: selectedDoctorData
            ? selectedDoctorData.firstname && selectedDoctorData.lastname
              ? `Dr. ${selectedDoctorData.firstname} ${selectedDoctorData.lastname}`
              : `Dr. ${selectedDoctorData.username}`
            : "Unknown Doctor",
          specialty: selectedDoctorData?.specialization || "General",
        },
      });

      // Update local state
      setDiagnoses(
        diagnoses.map((d) =>
          d.id === recentDiagnosis.id
            ? {
                ...d,
                appointmentRequested: true,
                appointmentStatus: "pending",
                appointmentNotes: appointmentNotes,
                appointmentRequestDate: new Date(),
                requestedDoctor: {
                  id: selectedDoctor,
                  name: selectedDoctorData
                    ? selectedDoctorData.firstname && selectedDoctorData.lastname
                      ? `Dr. ${selectedDoctorData.firstname} ${selectedDoctorData.lastname}`
                      : `Dr. ${selectedDoctorData.username}`
                    : "Unknown Doctor",
                  specialty: selectedDoctorData?.specialization || "General",
                },
                doctor: selectedDoctorData,
              }
            : d
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error("Error requesting appointment:", err);
      setError("Failed to request appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  // Filter diagnoses with appointment requests
  const appointmentDiagnoses = diagnoses.filter((d) => d.appointmentRequested);

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <Sidebar open={true} width={240} userData={userData} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
              <Link
                underline="hover"
                color="inherit"
                href="#"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Home
              </Link>
              <Typography color="text.primary">Appointment Panel</Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="h6" align="center">
                  Your Appointments
                </Typography>
              </Alert>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CalendarIcon />}
                  onClick={handleOpenModal}
                  sx={{ textTransform: "none" }}
                  disabled={!diagnoses.some((d) => !d.appointmentRequested)}
                >
                  New Appointment Request
                </Button>
              </Box>

              {appointmentDiagnoses.length === 0 ? (
                <Alert severity="info">No appointments found</Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table aria-label="appointments table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Request Date</TableCell>
                        <TableCell>Diagnosis</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Doctor</TableCell>
                        {/* <TableCell>Contact</TableCell> */}
                        <TableCell>Date/Time</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointmentDiagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                          <TableCell>
                            {diagnosis.appointmentRequestDate
                              ? format(diagnosis.appointmentRequestDate, "PPpp")
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {diagnosis.predictedDisease || "N/A"}
                            {diagnosis.recommendedDrug && (
                              <Box sx={{ mt: 1 }}>
                                <Chip
                                  size="small"
                                  label={`Medication: ${diagnosis.recommendedDrug}`}
                                  color="info"
                                  variant="outlined"
                                />
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                diagnosis.appointmentStatus === "approved" ? (
                                  <ApprovedIcon />
                                ) : diagnosis.appointmentStatus ===
                                  "pending" ? (
                                  <PendingIcon />
                                ) : (
                                  <RejectedIcon />
                                )
                              }
                              label={diagnosis.appointmentStatus}
                              color={
                                diagnosis.appointmentStatus === "approved"
                                  ? "success"
                                  : diagnosis.appointmentStatus === "pending"
                                  ? "warning"
                                  : "error"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {diagnosis.requestedDoctor ? (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                {diagnosis.requestedDoctor.photoURL && (
                                  <Avatar
                                    src={diagnosis.doctor.photoURL}
                                    sx={{ mr: 1, width: 32, height: 32 }}
                                  />
                                )}
                                <Box>
                                  <Typography>
                                    {diagnosis.requestedDoctor.name}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {diagnosis.requestedDoctor.specialty}
                                  </Typography>
                                </Box>
                              </Box>
                            ) : (
                              "Not assigned"
                            )}
                          </TableCell>
                          {/* <TableCell>
                            {diagnosis.requestedDoctor?.id ? (
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
                                <Typography variant="body2">
                                  {doctorEmails[diagnosis.requestedDoctor.id] ||
                                    "Loading..."}
                                </Typography>
                              </Box>
                            ) : (
                              "N/A"
                            )}
                            {diagnosis.doctor?.email && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  mt: 1,
                                }}
                              >
                                <EmailIcon sx={{ mr: 1 }} fontSize="small" />
                                <Typography variant="body2">
                                  {diagnosis.doctor.email}
                                </Typography>
                              </Box>
                            )}
                          </TableCell> */}
                          <TableCell>
                            {diagnosis.preferredDate ||
                            diagnosis.preferredTime ? (
                              <Box>
                                {diagnosis.preferredDate && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <CalendarIcon
                                      sx={{ mr: 1 }}
                                      fontSize="small"
                                    />
                                    <Typography variant="body2">
                                      {diagnosis.preferredDate}
                                    </Typography>
                                  </Box>
                                )}
                                {diagnosis.preferredTime && (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      mt: 1,
                                    }}
                                  >
                                    <TimeIcon sx={{ mr: 1 }} fontSize="small" />
                                    <Typography variant="body2">
                                      {diagnosis.preferredTime}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                            ) : (
                              "Not scheduled"
                            )}
                          </TableCell>
                          <TableCell>
                            {diagnosis.appointmentNotes || "No notes"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* New Appointment Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color="primary">
            New Appointment Request
          </Typography>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              <strong>Based on your recent diagnosis:</strong>
            </Typography>
            {diagnoses
              .filter((d) => !d.appointmentRequested)
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 1)
              .map((diagnosis) => (
                <Box
                  key={diagnosis.id}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid #eee",
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    <strong>Diagnosis:</strong>{" "}
                    {diagnosis.predictedDisease || "N/A"}
                  </Typography>
                  <Typography>
                    <strong>Date:</strong> {format(diagnosis.timestamp, "PPpp")}
                  </Typography>
                  {diagnosis.recommendedDrug && (
                    <Typography>
                      <strong>Recommended Medication:</strong>{" "}
                      {diagnosis.recommendedDrug}
                    </Typography>
                  )}
                </Box>
              ))}

            <TextField
              select
              fullWidth
              margin="normal"
              label="Select Doctor"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MedicalIcon />
                  </InputAdornment>
                ),
              }}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {doctor.photoURL && (
                      <Avatar
                        src={doctor.photoURL}
                        sx={{ mr: 2, width: 32, height: 32 }}
                      />
                    )}
                    <Box>
                      <Typography>
                        {doctor.firstname && doctor.lastname
                          ? `Dr. ${doctor.firstname} ${doctor.lastname}`
                          : `Dr. ${doctor.username}`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              margin="normal"
              multiline
              rows={4}
              label="Additional Notes"
              value={appointmentNotes}
              onChange={(e) => setAppointmentNotes(e.target.value)}
              placeholder="Please provide any additional information for the doctor..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseModal}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestAppointment}
            startIcon={<SendIcon />}
            disabled={!selectedDoctor}
          >
            Request Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppointmentPanel;
