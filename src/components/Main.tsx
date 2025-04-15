import React, { useState } from "react";
import {
  AppBar,
  Typography,
  ThemeProvider,
  CssBaseline,
  createTheme,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import Create from "./Create";
import Room from "./Room";
import "../css/Main.scss";
import ReactGA from "react-ga4";
import { BrowserRouter, Route } from "react-router-dom";
import { ANALYTICS_KEY } from "../env";

const theme = createTheme({
  typography: {
    fontFamily: ["Yeon Sung", "Sans Serif"].join(","),
    fontSize: 12,
    h3: {
      letterSpacing: "2px",
    },
  },
  palette: {
    primary: {
      main: "#2994ff",
    },
    background: {
      default: "#c2e0ff",
    },
  },
});

if (ANALYTICS_KEY) {
  ReactGA.initialize(ANALYTICS_KEY);
}

const Main = () => {
  const [username, setUsername] = useState("");
  const [mute, setMute] = useState(true);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className="menu">
          <Typography variant="h5">
            <a href="/">Hangmanonline.io</a>
          </Typography>
          <div className="volume" style={{ marginLeft: "10px" }}>
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
          <BrowserRouter>
            <Route exact path="/">
              <Create setUser={setUsername} user={username} />
            </Route>
            <Route path="/:roomID">
              <Room username={username} mute={mute} />
            </Route>
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </>
  );
};

export default Main;
