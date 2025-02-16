import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";


const Header = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  
  const location = useLocation();
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLoginStatus); 

    return () => window.removeEventListener("storage", checkLoginStatus); 
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }, 500); 

    return () => clearInterval(interval); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false); 
    history.push("/"); 
  };

  return (
    <AppBar position="sticky" elevation={3}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography 
          variant="h6" 
          sx={{ cursor: "pointer", fontWeight: "bold" }} 
          onClick={() => history.push("/events")}
        >
          Event Manager
        </Typography>

        <Box>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : location.pathname !== "/login" && (
            <Button color="inherit" onClick={() => history.push("/login")}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
