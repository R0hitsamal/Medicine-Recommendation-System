// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Container,
//   Box,
//   Card,
//   TextField,
//   Button,
//   Chip,
//   CircularProgress,
//   Divider,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Alert,
//   Badge,
// } from "@mui/material";
// import {
//   Biotech as MicroscopeIcon,
//   Verified as DiagnosisIcon,
//   CheckCircle as CheckCircleIcon,
//   Assessment as AssessmentIcon,
//   MedicalServices as MedicalServicesIcon,
//   Medication as MedicationIcon,
//   KingBed as RestIcon,
//   Warning as WarningIcon,
//   Search as SearchIcon,
// } from "@mui/icons-material";
// import { styled } from "@mui/material/styles";
// import axios from "axios";

// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import { doc, setDoc, getDoc } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import { getAuth } from "firebase/auth";

// // Styled Components
// const HeroCard = styled(Card)(({ theme }) => ({
//   background: "linear-gradient(135deg, #4361ee, #3a0ca3)",
//   borderRadius: "18px",
//   padding: theme.spacing(6),
//   color: "white",
//   marginBottom: theme.spacing(4),
//   boxShadow: "0 8px 24px rgba(67, 97, 238, 0.2)",
//   textAlign: "center",
// }));

// const FormCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: "18px",
//   padding: theme.spacing(5),
//   boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
//   marginBottom: theme.spacing(4),
// }));

// const ResultCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: "18px",
//   padding: theme.spacing(5),
//   boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
//   marginBottom: theme.spacing(4),
//   borderLeft: "6px solid #4361ee",
// }));

// const TreatmentCard = styled(Card)(({ theme }) => ({
//   backgroundColor: theme.palette.background.paper,
//   borderRadius: "18px",
//   padding: theme.spacing(5),
//   boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
//   borderTop: "6px solid #f72585",
// }));

// const DiagnosisBadge = styled(Box)(({ theme }) => ({
//   background: "rgba(67, 97, 238, 0.1)",
//   color: "#4361ee",
//   padding: theme.spacing(2, 3),
//   borderRadius: "12px",
//   display: "inline-flex",
//   alignItems: "center",
//   gap: theme.spacing(2),
//   fontSize: "1.2rem",
//   marginBottom: theme.spacing(3),
// }));

// const SymptomTag = styled(Chip)(({ theme }) => ({
//   background: "#4361ee",
//   color: "white",
//   padding: theme.spacing(1, 2),
//   borderRadius: "20px",
//   margin: theme.spacing(0.5),
//   boxShadow: "0 4px 8px rgba(67, 97, 238, 0.1)",
// }));

// const Disclaimer = styled(Box)(({ theme }) => ({
//   background: "rgba(247, 37, 133, 0.1)",
//   borderLeft: "4px solid #f72585",
//   padding: theme.spacing(2),
//   borderRadius: "0 12px 12px 0",
//   marginTop: theme.spacing(4),
//   display: "flex",
//   alignItems: "center",
//   gap: theme.spacing(1),
// }));

// const Diagnosis = () => {
//   const [symptoms, setSymptoms] = useState([]);
//   const [selectedSymptoms, setSelectedSymptoms] = useState([]);
//   const [prediction, setPrediction] = useState(null);
//   const [drugRecommendation, setDrugRecommendation] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [symptomInput, setSymptomInput] = useState("");
//   const [apiError, setApiError] = useState(null);
//   const [apiSuccess, setApiSuccess] = useState(null);
//   const [userData, setUserData] = useState(null);
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) return;

//       const userDoc = await getDoc(doc(db, "users", user.uid));
//       if (userDoc.exists()) {
//         const data = userDoc.data();
//         setUserData(data); // Save for Sidebar
//       }
//     };
//     fetchUserData();
//   }, []);
//   useEffect(() => {
//     const fetchSymptoms = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/symptoms");
//         let symptomsData = response.data;
//         if (typeof symptomsData === "object" && !Array.isArray(symptomsData)) {
//           symptomsData = symptomsData.symptoms || Object.values(symptomsData);
//         }
//         if (!Array.isArray(symptomsData)) {
//           throw new Error("Invalid symptoms data format");
//         }
//         setSymptoms(symptomsData);
//         setApiSuccess("Symptoms loaded successfully");
//         setTimeout(() => setApiSuccess(null), 3000);
//       } catch (error) {
//         console.error("Error fetching symptoms:", error);
//         setApiError("Failed to load symptoms. Using default list.");
//         setSymptoms([
//           "fever",
//           "headache",
//           "fatigue",
//           "cough",
//           "shortness_of_breath",
//           "chest_pain",
//           "nausea",
//         ]);
//       }
//     };
//     fetchSymptoms();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (selectedSymptoms.length === 0) return;
//     setLoading(true);
//     setPrediction(null);
//     setDrugRecommendation("");
//     setApiError(null);

//     try {
//       const response = await axios.post("http://localhost:5000/api/predict", {
//         symptoms: selectedSymptoms,
//       });

//       const predictedDisease = response.data.disease;
//       const recommendedDrug = response.data.drug;

//       setPrediction(predictedDisease);
//       setDrugRecommendation(recommendedDrug);
//       setApiSuccess("Diagnosis completed successfully");
//       setTimeout(() => setApiSuccess(null), 3000);

//       // 🔥 Save to Firestore
//       const auth = getAuth();
//       const user = auth.currentUser;

//       if (user) {
//         const diagnosisRef = doc(db, "diagnoses", `${user.uid}_${Date.now()}`);
//         await setDoc(diagnosisRef, {
//           uid: user.uid,
//           email: user.email,
//           timestamp: new Date(),
//           selectedSymptoms,
//           predictedDisease,
//           recommendedDrug,
//         });
//       }
//     } catch (error) {
//       console.error("Prediction error:", error);
//       setApiError("Failed to get diagnosis. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSymptomChange = (e) => {
//     setSelectedSymptoms(e.target.value);
//   };

//   const addCustomSymptom = () => {
//     if (symptomInput.trim() && !symptoms.includes(symptomInput)) {
//       setSymptoms([...symptoms, symptomInput]);
//       setSelectedSymptoms([...selectedSymptoms, symptomInput]);
//       setSymptomInput("");
//     }
//   };

//   const formatSymptomName = (symptom) =>
//     symptom
//       .split("_")
//       .join(" ")
//       .replace(/\b\w/g, (l) => l.toUpperCase());

//   return (
//     <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f7fa" }}>
//       <Sidebar open={true} width={240} userData={userData} />
//       <Box sx={{ flexGrow: 1 }}>
//         <Header />
//         <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
//           <HeroCard>
//             <Typography variant="h4" gutterBottom>
//               <MicroscopeIcon sx={{ mr: 2, verticalAlign: "middle" }} />
//               AI-Powered Symptom Analysis
//             </Typography>
//             <Typography variant="body1" sx={{ mb: 3 }}>
//               Our advanced neural network evaluates your symptoms to identify
//               potential conditions.
//             </Typography>
//             <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
//               <Badge badgeContent="96%" sx={badgeStyle}>
//                 Accuracy
//               </Badge>
//               <Badge badgeContent="Instant" sx={badgeStyle}>
//                 Results
//               </Badge>
//               <Badge badgeContent="Validated" sx={badgeStyle}>
//                 Clinically
//               </Badge>
//             </Box>
//           </HeroCard>

//           {apiError && (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {apiError}
//             </Alert>
//           )}
//           {apiSuccess && (
//             <Alert severity="success" sx={{ mb: 3 }}>
//               {apiSuccess}
//             </Alert>
//           )}

//           <FormCard>
//             <form onSubmit={handleSubmit}>
//               <FormControl fullWidth sx={{ mb: 4 }}>
//                 <InputLabel>Select Your Symptoms</InputLabel>
//                 <Select
//                   multiple
//                   value={selectedSymptoms}
//                   onChange={handleSymptomChange}
//                   label="Select Your Symptoms"
//                   renderValue={(selected) =>
//                     selected.map((s) => formatSymptomName(s)).join(", ")
//                   }
//                 >
//                   {symptoms.map((symptom) => (
//                     <MenuItem key={symptom} value={symptom}>
//                       {formatSymptomName(symptom)}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl>

//               <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
//                 <TextField
//                   fullWidth
//                   value={symptomInput}
//                   onChange={(e) => setSymptomInput(e.target.value)}
//                   label="Add custom symptom"
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={addCustomSymptom}
//                   disabled={!symptomInput.trim()}
//                 >
//                   Add
//                 </Button>
//               </Box>

//               <Button
//                 type="submit"
//                 variant="contained"
//                 size="large"
//                 fullWidth
//                 disabled={selectedSymptoms.length === 0 || loading}
//                 startIcon={<SearchIcon />}
//               >
//                 {loading ? "Analyzing..." : "Analyze Symptoms"}
//               </Button>
//             </form>
//           </FormCard>

//           {loading && (
//             <Box sx={{ textAlign: "center", py: 4 }}>
//               <CircularProgress sx={{ color: "#4361ee", mb: 2 }} size={60} />
//               <Typography variant="h6">Processing your symptoms...</Typography>
//               <Typography color="text.secondary">
//                 This typically takes just a few seconds
//               </Typography>
//             </Box>
//           )}

//           {prediction && !loading && (
//             <>
//               <ResultCard>
//                 <Typography variant="h6" gutterBottom>
//                   <CheckCircleIcon sx={{ mr: 1 }} /> Selected Symptoms
//                 </Typography>
//                 <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                   {selectedSymptoms.map((s) => (
//                     <SymptomTag
//                       key={s}
//                       label={formatSymptomName(s)}
//                       onDelete={() => {
//                         setSelectedSymptoms(
//                           selectedSymptoms.filter((sym) => sym !== s)
//                         );
//                       }}
//                     />
//                   ))}
//                 </Box>
//               </ResultCard>

//               <ResultCard>
//                 <Typography variant="h5" gutterBottom>
//                   <AssessmentIcon sx={{ mr: 1 }} /> Analysis Result
//                 </Typography>
//                 <DiagnosisBadge>
//                   <DiagnosisIcon fontSize="large" />
//                   <Box>
//                     <Typography>Our assessment suggests:</Typography>
//                     <Typography variant="h4" fontWeight={600}>
//                       {prediction}
//                     </Typography>
//                   </Box>
//                 </DiagnosisBadge>
//                 <Box mt={3}>
//                   <Typography variant="h6">Recommended Treatment:</Typography>
//                   <Typography variant="h5" color="primary" mt={1}>
//                     {drugRecommendation}
//                   </Typography>
//                 </Box>
//               </ResultCard>

//               <TreatmentCard>
//                 <Typography variant="h6" gutterBottom>
//                   <MedicalServicesIcon sx={{ mr: 1 }} /> Recommended Next Steps
//                 </Typography>
//                 <List>
//                   <ListItem>
//                     <ListItemIcon>
//                       <MedicalServicesIcon />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary="Professional Consultation"
//                       secondary="Schedule an appointment with a healthcare provider"
//                     />
//                   </ListItem>
//                   <Divider />
//                   <ListItem>
//                     <ListItemIcon>
//                       <MedicationIcon />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary="Medication"
//                       secondary={drugRecommendation}
//                     />
//                   </ListItem>
//                   <Divider />
//                   <ListItem>
//                     <ListItemIcon>
//                       <RestIcon />
//                     </ListItemIcon>
//                     <ListItemText
//                       primary="Rest & Recovery"
//                       secondary="Ensure adequate rest and hydration"
//                     />
//                   </ListItem>
//                 </List>
//                 <Disclaimer>
//                   <WarningIcon color="warning" />
//                   <Typography variant="body2">
//                     This AI assessment is for informational purposes only and
//                     should not replace professional medical advice.
//                   </Typography>
//                 </Disclaimer>
//               </TreatmentCard>
//             </>
//           )}
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// const badgeStyle = {
//   backgroundColor: "white",
//   color: "#4361ee",
//   px: 2,
//   py: 1,
//   borderRadius: "4px",
// };

// export default Diagnosis;

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ListGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import {
  BiCheckCircle as CheckCircleIcon,
  BiAnalyse as AssessmentIcon,
  BiPlusMedical as MedicalServicesIcon,
  BiCapsule as MedicationIcon,
  BiBed as KingBedIcon,
  BiError as WarningIcon,
  BiSearchAlt as SearchIcon,
  BiCheckShield as VerifiedIcon,
  BiX as CloseIcon,
} from "react-icons/bi";
import axios from "axios";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import debounce from "lodash.debounce";

const Diagnosis = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({
    symptom1: "",
    symptom2: "",
    symptom3: "",
    symptom4: "",
    symptom5: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [drugRecommendation, setDrugRecommendation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/symptoms");
        let symptomsData = response.data;
        if (typeof symptomsData === "object" && !Array.isArray(symptomsData)) {
          symptomsData = symptomsData.symptoms || Object.values(symptomsData);
        }
        setSymptoms(symptomsData);
      } catch (err) {
        console.error("Error fetching symptoms:", err);
        setError("Failed to load symptoms. Using default list.");
        setSymptoms([
          "fever",
          "headache",
          "fatigue",
          "cough",
          "shortness_of_breath",
          "chest_pain",
          "nausea",
          "itching",
          "rash",
          "sneezing",
          "sore_throat",
          "muscle_pain",
          "diarrhea",
          "vomiting",
          "dizziness",
          "abdominal_pain",
          "back_pain",
          "constipation",
          "difficulty_swallowing",
          "ear_pain",
          "eye_pain",
          "fainting",
          "hair_loss",
          "heartburn",
          "joint_pain",
          "memory_loss",
          "nosebleed",
          "numbness",
          "pelvic_pain",
          "swelling",
          "thirst",
          "tinnitus",
          "toothache",
          "urinary_incontinence",
          "vision_problems",
          "weight_gain",
          "weight_loss",
          "wheezing",
        ]);
      }
    };
    fetchSymptoms();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((term) => {
        if (!term.trim()) {
          setSearchResults([]);
          return;
        }
        const lowerTerm = term.toLowerCase();
        const results = symptoms.filter((symptom) => {
          const formattedSymptom = formatSymptomName(symptom).toLowerCase();
          return formattedSymptom.includes(lowerTerm);
        });

        results.sort((a, b) => {
          const aName = formatSymptomName(a).toLowerCase();
          const bName = formatSymptomName(b).toLowerCase();

          if (aName === lowerTerm) return -1;
          if (bName === lowerTerm) return 1;

          const aStartsWith = aName.startsWith(lowerTerm);
          const bStartsWith = bName.startsWith(lowerTerm);
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          return aName.localeCompare(bName);
        });

        setSearchResults(results.slice(0, 10));
      }, 200),
    [symptoms]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedSymptoms((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearchChange = (e, fieldName) => {
    setSearchTerm(e.target.value);
    setActiveDropdown(fieldName);
  };

  const handleSymptomSelect = (symptom, fieldName) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [fieldName]: symptom,
    }));
    setSearchTerm("");
    setSearchResults([]);
    setActiveDropdown(null);
  };

  const handleClearSymptom = (fieldName) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [fieldName]: "",
    }));
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);
    setDrugRecommendation("");

    try {
      const symptomsToSend = Object.values(selectedSymptoms).filter((s) => s);
      if (symptomsToSend.length === 0) {
        throw new Error("Please enter at least one symptom");
      }

      const response = await axios.post("http://localhost:5000/api/predict", {
        symptoms: symptomsToSend,
      });

      setPrediction(response.data.disease);
      setDrugRecommendation(response.data.drug);
      setSuccess("Diagnosis completed successfully");
      setTimeout(() => setSuccess(""), 3000);

      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const diagnosisRef = doc(db, "diagnoses", `${user.uid}_${Date.now()}`);
        await setDoc(diagnosisRef, {
          uid: user.uid,
          email: user.email,
          patientName: userData
            ? `${userData.firstname} ${userData.lastname}`.trim()
            : user.displayName || user.email,
          firstname: userData?.firstname || "",
          lastname: userData?.lastname || "",
          birth_date: userData?.birth_date || null,
          timestamp: new Date(),
          symptoms: symptomsToSend,
          predictedDisease: response.data.disease,
          recommendedDrug: response.data.drug,
          recomendation: false,
        });
      }
    } catch (err) {
      console.error("Prediction error:", err);
      setError(err.message || "Failed to get diagnosis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatSymptomName = (symptom) => {
    if (!symptom) return "";
    return symptom
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const highlightMatch = (text, search) => {
    if (!search.trim()) return text;

    const lowerText = text.toLowerCase();
    const lowerSearch = search.toLowerCase();
    const matchIndex = lowerText.indexOf(lowerSearch);

    if (matchIndex === -1) return text;

    return (
      <>
        {text.substring(0, matchIndex)}
        <span className="text-primary fw-bold">
          {text.substring(matchIndex, matchIndex + search.length)}
        </span>
        {text.substring(matchIndex + search.length)}
      </>
    );
  };

  return (
    <div id="page-top">
      <Header />
      <div id="wrapper" style={{ paddingTop: "90px" }}>
        <Sidebar open={true} width={240} userData={userData} />

        <div id="content-wrapper">
          <Container fluid>
            {error && (
              <Alert
                variant="danger"
                className="mt-3"
                onClose={() => setError("")}
                dismissible
              >
                {error}
              </Alert>
            )}
            {success && (
              <Alert
                variant="success"
                className="mt-3"
                onClose={() => setSuccess("")}
                dismissible
              >
                {success}
              </Alert>
            )}

            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="mb-4">
                  <Card.Header className="text-center alert alert-info">
                    Disease Prediction Panel
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      {[1, 2, 3, 4, 5].map((num) => {
                        const fieldName = `symptom${num}`;
                        const currentValue = selectedSymptoms[fieldName];

                        return (
                          <Form.Group
                            as={Row}
                            className="mb-3"
                            key={`symptom-${num}`}
                          >
                            <Form.Label column sm={2}>
                              Symptom {num}
                            </Form.Label>
                            <Col sm={8}>
                              <Dropdown
                                show={
                                  activeDropdown === fieldName &&
                                  searchResults.length > 0
                                }
                                onToggle={(isOpen) => {
                                  if (!isOpen) setActiveDropdown(null);
                                }}
                              >
                                <div className="d-flex">
                                  <FormControl
                                    type="text"
                                    placeholder={
                                      currentValue
                                        ? formatSymptomName(currentValue)
                                        : "Type to search symptoms..."
                                    }
                                    value={
                                      activeDropdown === fieldName
                                        ? searchTerm
                                        : currentValue
                                        ? formatSymptomName(currentValue)
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleSearchChange(e, fieldName)
                                    }
                                    onClick={() => setActiveDropdown(fieldName)}
                                    readOnly={!!currentValue}
                                    autoComplete="off"
                                  />
                                  {currentValue && (
                                    <Button
                                      variant="outline-secondary"
                                      onClick={() =>
                                        handleClearSymptom(fieldName)
                                      }
                                      className="ms-2"
                                    >
                                      <CloseIcon />
                                    </Button>
                                  )}
                                </div>
                                <Dropdown.Menu
                                  style={{
                                    width: "100%",
                                    maxHeight: "300px",
                                    overflowY: "auto",
                                  }}
                                >
                                  {searchResults.length > 0 ? (
                                    searchResults.map((symptom) => (
                                      <Dropdown.Item
                                        key={symptom}
                                        onClick={() =>
                                          handleSymptomSelect(
                                            symptom,
                                            fieldName
                                          )
                                        }
                                        className="d-flex align-items-center"
                                      >
                                        {highlightMatch(
                                          formatSymptomName(symptom),
                                          searchTerm
                                        )}
                                      </Dropdown.Item>
                                    ))
                                  ) : searchTerm ? (
                                    <Dropdown.Item disabled>
                                      No symptoms found matching "{searchTerm}"
                                    </Dropdown.Item>
                                  ) : (
                                    <Dropdown.Item disabled>
                                      Start typing to search symptoms
                                    </Dropdown.Item>
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </Col>
                          </Form.Group>
                        );
                      })}

                      <Form.Group as={Row} className="mb-3">
                        <Col sm={{ span: 8, offset: 2 }}>
                          <Button
                            variant="primary"
                            onClick={handlePredict}
                            disabled={
                              loading ||
                              !Object.values(selectedSymptoms).some(Boolean)
                            }
                            className="w-100 py-2"
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Predicting...
                              </>
                            ) : (
                              <>
                                <SearchIcon className="me-2" />
                                Predict
                              </>
                            )}
                          </Button>
                        </Col>
                      </Form.Group>
                    </Form>

                    {prediction && (
                      <div className="mt-4">
                        <Card className="mb-3 border-primary">
                          <Card.Header className="bg-primary text-white d-flex align-items-center">
                            <VerifiedIcon className="me-2" size={20} />
                            <span>Diagnosis Result</span>
                          </Card.Header>
                          <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                              <CheckCircleIcon
                                className="me-2 text-success"
                                size={24}
                              />
                              <h5 className="mb-0">Our assessment suggests:</h5>
                            </div>
                            <div className="text-center py-3 bg-light rounded">
                              <h4 className="text-primary mb-0">
                                {prediction}
                              </h4>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Diagnosis;
