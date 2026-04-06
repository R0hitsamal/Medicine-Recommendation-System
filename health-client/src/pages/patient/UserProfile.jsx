import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  TextField,
  MenuItem,
  Select,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Toolbar,
  Box,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Import your layout components
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const CreateProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    birth_date: null,
    gender: "",
    country: "",
    region: "",
  });
  const [messages, setMessages] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null); // For Sidebar props

  const genderOptions = [
    { value: "", label: "Please Select Your Gender ................" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data); // Save for Sidebar
        setFormData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          birth_date: data.birth_date ? new Date(data.birth_date) : null,
          gender: data.gender || "",
          country: data.country || "",
          region: data.region || "",
        });
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      birth_date: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstname) newErrors.firstname = "First name is required";
    if (!formData.lastname) newErrors.lastname = "Last name is required";
    if (!formData.birth_date) newErrors.birth_date = "Birth date is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.region) newErrors.region = "Region is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setMessages([{ text: "Please fill all required fields", type: "error" }]);
      return;
    }

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          birth_date: formData.birth_date.toISOString(),
          gender: formData.gender,
          country: formData.country,
          region: formData.region,
          profileCreated: true,
        },
        { merge: true }
      );

      setMessages([{ text: "Profile saved successfully!", type: "success" }]);
      navigate("/user-dashboard");
      setErrors({});
    } catch (error) {
      console.error(error);
      setMessages([{ text: "Failed to save profile", type: "error" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <Box sx={{ display: "flex" }}>
        <Sidebar open={true} width={240} userData={userData} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title="Create Your Profile"
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  />
                  <CardContent>
                    <form onSubmit={handleSubmit}>
                      <TextField
                        name="firstname"
                        label="First Name"
                        value={formData.firstname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.firstname}
                        helperText={errors.firstname}
                      />
                      <TextField
                        name="lastname"
                        label="Last Name"
                        value={formData.lastname}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.lastname}
                        helperText={errors.lastname}
                      />
                      <FormControl fullWidth margin="normal">
                        <DatePicker
                          selected={formData.birth_date}
                          onChange={handleDateChange}
                          minDate={new Date(1950, 0, 1)}
                          maxDate={new Date()}
                          placeholderText="Date of birth"
                          className="react-datepicker__input-text"
                          wrapperClassName="date-picker-wrapper"
                          required
                          dateFormat="dd/MM/yyyy"
                        />
                        {errors.birth_date && (
                          <span style={{ color: "red", fontSize: "0.75rem" }}>
                            {errors.birth_date}
                          </span>
                        )}
                      </FormControl>

                      <FormControl
                        fullWidth
                        margin="normal"
                        error={!!errors.gender}
                      >
                        <InputLabel>Gender</InputLabel>
                        <Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          label="Gender"
                          required
                        >
                          {genderOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.gender && (
                          <span style={{ color: "red", fontSize: "0.75rem" }}>
                            {errors.gender}
                          </span>
                        )}
                      </FormControl>

                      <TextField
                        name="country"
                        label="Country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.country}
                        helperText={errors.country}
                      />

                      <TextField
                        name="region"
                        label="Religion"
                        value={formData.region}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        error={!!errors.region}
                        helperText={errors.region}
                      />

                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ mt: 2 }}
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </form>

                    {messages.map((message, index) => (
                      <Alert
                        key={index}
                        severity={
                          message.type === "error" ? "error" : "success"
                        }
                        sx={{ mt: 2 }}
                      >
                        {message.text}
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default CreateProfile;
