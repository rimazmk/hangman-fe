import React, { useState } from "react";
import {
  AppBar,
  Typography,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core";
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

  return (
    <>
      <AppBar position="static" className="menu">
        <Typography variant="h5">
          <a href="http://localhost:3000/">Hangman</a>
        </Typography>
      </AppBar>
      <div className="container">
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <Route exact path="/">
              <Create setUser={setUsername} />
            </Route>
            <Route path="/:roomID">
              <Room username={username} />
            </Route>
          </BrowserRouter>
        </ThemeProvider>
      </div>
    </>
  );
};

export default Main;
