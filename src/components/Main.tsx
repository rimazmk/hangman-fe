import React, { useState } from "react";
import {
  AppBar,
  Typography,
  ThemeProvider,
  CssBaseline,
  createMuiTheme,
} from "@material-ui/core";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
// import HomeIcon from "@material-ui/icons/Home";
import Create from "./Create";
import Room from "./Room";
import "../css/Main.scss";
import { BrowserRouter, Route } from "react-router-dom";

const theme = createMuiTheme({
  typography: {
    fontFamily: ["Yeon Sung", "Sans Serif"].join(","),
    h3: {
      letterSpacing: "2px",
    },
  },
  palette: {
    primary: {
      main: "#000000",
    },
    background: {
      default: "#d2d2d2",
    },
  },
});

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
              <Create setUser={setUsername} />
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
