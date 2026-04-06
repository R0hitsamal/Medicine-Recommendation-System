import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { Box, CssBaseline, Button, Toolbar, Typography } from "@mui/material";
import { KeyboardArrowUp as AngleUpIcon } from "@mui/icons-material";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "./UserHome";
import { auth, db } from "../../config/firebase"; // Adjust path if needed

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const UserDashBoard = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileStatus, setProfileStatus] = useState("");

  useEffect(() => {
    const checkProfileStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log(userData);
          if (userData.profileCreated === false) {
            console.log("Hit");
            setProfileStatus("Please Create Profile To Continue");
          }
        }
      }
    };
    checkProfileStatus();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const db = getFirestore();
        const userRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} width={drawerWidth} userData={userData} />
      <Main open={open}>
        <Toolbar />
        <Dashboard />
        {profileStatus && (
          <div className="text-center my-4">
            <h4 style={{ color: "red" }}>{profileStatus}</h4>
          </div>
        )}
        {/* <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="outlined"
            startIcon={<AngleUpIcon />}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to Top
          </Button>
        </Box> */}
      </Main>
    </Box>
  );
};

export default UserDashBoard;
