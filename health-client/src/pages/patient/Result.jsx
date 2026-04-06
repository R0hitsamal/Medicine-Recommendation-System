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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Home as HomeIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  MedicalServices as MedicalIcon,
  LocalPharmacy as PharmacyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
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

const Result = () => {
  const [userData, setUserData] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    doctorSuggestion: "",
  });
  const [appointmentData, setAppointmentData] = useState({
    notes: "",
    selectedDoctor: "",
    preferredDate: "",
    preferredTime: "",
  });

  // Fetch user data, their diagnoses, and available doctors
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

        setDoctors(availableDoctors);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDetailsModal = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    const nameParts = diagnosis.patientName
      ? diagnosis.patientName.split(" ")
      : ["", ""];
    setFormData({
      firstName: diagnosis.firstname || nameParts[0] || "",
      lastName: diagnosis.lastname || nameParts[1] || "",
      email: diagnosis.email || "",
      doctorSuggestion: diagnosis.doctorSuggestion || "",
    });
    setOpenDetailsModal(true);
  };

  const handleOpenAppointmentModal = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setAppointmentData({
      notes: "",
      selectedDoctor: "",
      preferredDate: "",
      preferredTime: "",
    });
    setOpenAppointmentModal(true);
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
  };

  const handleCloseAppointmentModal = () => {
    setOpenAppointmentModal(false);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAppointmentDataChange = (e) => {
    const { name, value } = e.target;
    setAppointmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequestAppointment = async () => {
    if (!selectedDiagnosis) return;

    try {
      const selectedDoctorData = doctors.find(
        (doctor) => doctor.id === appointmentData.selectedDoctor
      );

      const diagnosisRef = doc(db, "diagnoses", selectedDiagnosis.id);
      await updateDoc(diagnosisRef, {
        appointmentRequested: true,
        appointmentStatus: "pending",
        appointmentNotes: appointmentData.notes,
        appointmentRequestDate: new Date(),
        requestedDoctor: {
          id: appointmentData.selectedDoctor,
          name: selectedDoctorData
            ? `${selectedDoctorData.username}`
            : "Unknown Doctor",
          specialty: selectedDoctorData?.specialty || "General",
        },
        preferredDate: appointmentData.preferredDate,
        preferredTime: appointmentData.preferredTime,
      });

      setDiagnoses(
        diagnoses.map((d) =>
          d.id === selectedDiagnosis.id
            ? {
                ...d,
                appointmentRequested: true,
                appointmentStatus: "pending",
                appointmentNotes: appointmentData.notes,
                appointmentRequestDate: new Date(),
                requestedDoctor: {
                  id: appointmentData.selectedDoctor,
                  name: selectedDoctorData
                    ? `${selectedDoctorData.firstName} ${selectedDoctorData.lastName}`
                    : "Unknown Doctor",
                  specialty: selectedDoctorData?.specialty || "General",
                },
                preferredDate: appointmentData.preferredDate,
                preferredTime: appointmentData.preferredTime,
              }
            : d
        )
      );

      handleCloseAppointmentModal();
    } catch (err) {
      console.error("Error requesting appointment:", err);
      setError("Failed to request appointment");
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedDiagnosis) return;

      const diagnosisRef = doc(db, "diagnoses", selectedDiagnosis.id);
      await updateDoc(diagnosisRef, {
        firstname: formData.firstName,
        lastname: formData.lastName,
        patientName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        doctorSuggestion: formData.doctorSuggestion,
      });

      setDiagnoses(
        diagnoses.map((d) =>
          d.id === selectedDiagnosis.id
            ? {
                ...d,
                firstname: formData.firstName,
                lastname: formData.lastName,
                patientName: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                doctorSuggestion: formData.doctorSuggestion,
              }
            : d
        )
      );

      handleCloseDetailsModal();
    } catch (err) {
      console.error("Error updating diagnosis:", err);
      setError("Failed to update diagnosis");
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
              <Typography color="text.primary">
                Medical Check Up Panel
              </Typography>
            </Breadcrumbs>

            <Box sx={{ mb: 3 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="h6" align="center">
                  List Of Disease Diagnosed
                </Typography>
              </Alert>

              {diagnoses.length === 0 ? (
                <Alert severity="info">No diagnosis history found</Alert>
              ) : (
                <TableContainer component={Paper}>
                  <Table aria-label="diagnosis table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Disease</TableCell>
                        <TableCell>Medicine</TableCell>
                        <TableCell>Appointment</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {diagnoses.map((diagnosis) => (
                        <TableRow key={diagnosis.id}>
                          <TableCell>{diagnosis.id.slice(0, 8)}</TableCell>
                          <TableCell>
                            {diagnosis.patientName ||
                              (diagnosis.firstname && diagnosis.lastname
                                ? `${diagnosis.firstname} ${diagnosis.lastname}`
                                : diagnosis.username || diagnosis.email || "N/A")}
                          </TableCell>
                          <TableCell>
                            {diagnosis.predictedDisease || "N/A"}
                          </TableCell>
                          <TableCell>
                            <TableCell>
                              {diagnosis.recomendation === true ? (
                                <Chip
                                  icon={<PharmacyIcon />}
                                  label={diagnosis.recommendedDrug}
                                  color="success"
                                  variant="outlined"
                                />
                              ) : (
                                "Yet Recommended"
                              )}
                            </TableCell>
                          </TableCell>
                          <TableCell>
                            {diagnosis.appointmentRequested ? (
                              <Box>
                                <Chip
                                  label={
                                    diagnosis.appointmentStatus === "pending"
                                      ? "Requested"
                                      : diagnosis.appointmentStatus ===
                                        "approved"
                                      ? "Approved"
                                      : "Rejected"
                                  }
                                  color={
                                    diagnosis.appointmentStatus === "pending"
                                      ? "warning"
                                      : diagnosis.appointmentStatus ===
                                        "approved"
                                      ? "success"
                                      : "error"
                                  }
                                  sx={{ mb: 1 }}
                                />
                                {diagnosis.requestedDoctor && (
                                  <Typography variant="body2">
                                    With: {diagnosis.requestedDoctor.name} (
                                    {diagnosis.requestedDoctor.specialty})
                                  </Typography>
                                )}
                              </Box>
                            ) : (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<CalendarIcon />}
                                onClick={() =>
                                  handleOpenAppointmentModal(diagnosis)
                                }
                                sx={{ textTransform: "none" }}
                              >
                                Request
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleOpenDetailsModal(diagnosis)}
                            >
                              Details
                            </Button>
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

      {/* Diagnosis Details Modal */}
      <Dialog
        open={openDetailsModal}
        onClose={handleCloseDetailsModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color="primary">
            Diagnosis Details
          </Typography>
          <IconButton onClick={handleCloseDetailsModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDiagnosis && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Date:</strong>{" "}
                  {selectedDiagnosis.timestamp?.toDate().toLocaleString()}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <strong>Diagnosis:</strong>{" "}
                  {selectedDiagnosis.predictedDisease}
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                  <strong>Recommended Treatment:</strong>{" "}
                  {selectedDiagnosis.recommendedDrug || "Not specified"}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Patient Information</strong>
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Box>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Doctor's Suggestions</strong>
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  id="doctorSuggestion"
                  label="Doctor's Recommendations"
                  multiline
                  rows={4}
                  value={formData.doctorSuggestion}
                  onChange={handleInputChange}
                  placeholder="Enter any additional recommendations or notes from the doctor"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseDetailsModal}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Appointment Request Modal */}
      <Dialog
        open={openAppointmentModal}
        onClose={handleCloseAppointmentModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" color="primary">
            Request Appointment
          </Typography>
          <IconButton onClick={handleCloseAppointmentModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDiagnosis && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Patient:</strong>{" "}
                  {selectedDiagnosis.patientName ||
                    selectedDiagnosis.email ||
                    "N/A"}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Diagnosis:</strong>{" "}
                  {selectedDiagnosis.predictedDisease || "N/A"}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Recommended Treatment:</strong>{" "}
                  {selectedDiagnosis.recommendedDrug || "Not specified"}
                </Typography>
              </Box>

              <Box sx={{ mt: 3 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="doctor-select-label">
                    Select Doctor
                  </InputLabel>
                  <Select
                    labelId="doctor-select-label"
                    id="doctor-select"
                    name="selectedDoctor"
                    value={appointmentData.selectedDoctor}
                    onChange={handleAppointmentDataChange}
                    label="Select Doctor"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PersonIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography>Dr. {doctor.username}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {doctor.specialty || "General Practitioner"}
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  margin="normal"
                  fullWidth
                  name="preferredDate"
                  label="Preferred Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={appointmentData.preferredDate}
                  onChange={handleAppointmentDataChange}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="preferredTime"
                  label="Preferred Time"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                  value={appointmentData.preferredTime}
                  onChange={handleAppointmentDataChange}
                />

                <TextField
                  margin="normal"
                  fullWidth
                  name="notes"
                  label="Additional Information"
                  multiline
                  rows={4}
                  value={appointmentData.notes}
                  onChange={handleAppointmentDataChange}
                  placeholder="Please provide any additional information that might help the doctor understand your needs"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={handleCloseAppointmentModal}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRequestAppointment}
            startIcon={<CalendarIcon />}
            disabled={!appointmentData.selectedDoctor}
          >
            Request Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Result;
