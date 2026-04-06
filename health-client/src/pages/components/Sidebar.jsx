import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MedicalServices as MedicalServicesIcon,
  Article as ArticleIcon,
  CalendarToday as CalendarTodayIcon,
  Person as PersonIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ open, width, userData }) => {
  const navigate = useNavigate();

  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          backgroundColor: "#212529",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem button onClick={() => navigate("/user-dashboard")}>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Patient Dashboard" sx={{ color: "white" }} />
          </ListItem>
          {userData && (
            <ListItem>
              <ListItemIcon>
                <AccountCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={`Logged As ${
                  userData.firstname && userData.lastname
                    ? `${userData.firstname} ${userData.lastname}`
                    : userData.username
                }`}
                sx={{ color: "white" }}
              />
            </ListItem>
          )}
        </List>
        <Divider />
        {userData?.role === "doctor" ? (
          <>
            <ListItem button onClick={() => navigate("/drug")}>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Diagnosis Results"
                sx={{ color: "white" }}
              />
            </ListItem>
            <ListItem button onClick={() => navigate("/appointment-doctor")}>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Appointment" sx={{ color: "white" }} />
            </ListItem>
          </>
        ) : userData?.profileCreated ? (
          <>
            <ListItem button onClick={() => navigate("/diagonosis")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Make Diagonosis" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button onClick={() => navigate("/result")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Diagonosis Result"
                sx={{ color: "white" }}
              />
            </ListItem>
            <ListItem button onClick={() => navigate("/appointment")}>
              <ListItemIcon>
                <MedicalServicesIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Start Appointment"
                sx={{ color: "white" }}
              />
            </ListItem>
            <ListItem button onClick={() => navigate("/create-profile")}>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="User Profile" sx={{ color: "white" }} />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={() => navigate("/create-profile")}>
            <ListItemIcon>
              <PersonIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="User Profile" sx={{ color: "white" }} />
          </ListItem>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
