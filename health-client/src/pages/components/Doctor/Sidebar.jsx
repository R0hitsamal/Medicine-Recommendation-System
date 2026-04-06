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
        {userData?.role === "doctor" ? (
          <>
            <ListItem button onClick={() => navigate("/doctor-dashboard")}>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="DashBoard" sx={{ color: "white" }} />
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
            <ListItem button onClick={() => navigate("/drug")}>
              <ListItemIcon>
                <ArticleIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Drug Approve" sx={{ color: "white" }} />
            </ListItem>
            <ListItem button onClick={() => navigate("/appointment-doctor")}>
              <ListItemIcon>
                <CalendarTodayIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Appointment" sx={{ color: "white" }} />
            </ListItem>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
