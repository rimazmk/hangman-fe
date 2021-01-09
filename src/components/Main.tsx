import React, { useState } from "react";
import {
  AppBar,
  Typography,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import HomeIcon from "@material-ui/icons/Home";
import Create from "./Create";
import Room from "./Room";
import "../css/Main.scss";
import { BrowserRouter, Route } from "react-router-dom";

const theme = createMuiTheme();
theme.typography.h6 = {
  fontSize: "1rem",
};

const Main = () => {
  const [username, setUsername] = useState("");
  const [mute, setMute] = useState(true);

  return (
    <>
      <AppBar position="static" className="menu">
        <Typography variant="h5" style={{ flex: 1 }}>
          <a href="http://localhost:3000/">hangmanonline.io</a>
        </Typography>
        {/* <HomeIcon
          fontSize="large"
          onClick={() => (window.location.href = "http://localhost:3000/")}
        ></HomeIcon> */}
        <div>
          {!mute && (
            <VolumeUpIcon
              onClick={() => setMute(!mute)}
              fontSize="large"
            ></VolumeUpIcon>
          )}
          {mute && (
            <VolumeOffIcon
              onClick={() => setMute(!mute)}
              fontSize="large"
            ></VolumeOffIcon>
          )}
        </div>
      </AppBar>
      <div className="container">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Route exact path="/">
              <Create setUser={setUsername} />
            </Route>
            <Route path="/:roomID">
              <Room username={username} mute={mute} />
            </Route>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Main;
