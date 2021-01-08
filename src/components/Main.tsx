import React, { useState } from "react";
import { AppBar, Typography } from "@material-ui/core";
import Create from "./Create";
import Room from "./Room";
import "../css/Main.scss";
import { BrowserRouter, Route } from "react-router-dom";

const Main = () => {
  const [username, setUsername] = useState("");

  return (
    <>
      <AppBar position="static" className="menu">
        <Typography variant="h6">Hangman</Typography>
      </AppBar>
      <div className="container">
        <BrowserRouter>
          <Route exact path="/">
            <Create setUser={setUsername} />
          </Route>
          <Route path="/:roomID">
            <Room username={username} />
          </Route>
        </BrowserRouter>
      </div>
    </>
  );
};

export default Main;
