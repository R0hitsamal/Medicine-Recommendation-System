import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginForm from "./pages/Login";
import RegistrationForm from "./pages/SIgnup";
import Doctor from "./pages/Doctor";
import AboutPage from "./pages/About";
import UserDashBoard from "./pages/patient/Dashboard";
import CreateProfile from "./pages/patient/UserProfile";
import Dashboard from "./pages/patient/UserHome";
import AppointmentPanel from "./pages/patient/Appointment";
import Diagonosis from "./pages/patient/Diagonosis";
import Result from "./pages/patient/Result";
import DoctorDashboard from "./pages/doctor/DashBoard";
import DoctorAppointmentPanel from "./pages/doctor/Appointment";
import DrugRecommendationPanel from "./pages/doctor/Reccomend";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/dr_list" element={<Doctor />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/user-dashboard" element={<UserDashBoard />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          <Route path="/home-user" element={<Dashboard />} />
          <Route path="/appointment" element={<AppointmentPanel />} />
          <Route path="/diagonosis" element={<Diagonosis />} />
          <Route path="/result" element={<Result />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route
            path="/appointment-doctor"
            element={<DoctorAppointmentPanel />}
          />
          <Route path="/drug" element={<DrugRecommendationPanel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
