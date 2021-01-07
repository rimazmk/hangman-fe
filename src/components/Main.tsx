import React, { useState } from "react";
import { AppBar } from "@material-ui/core";
import Create from "./Create";
import Room from "./Room";
import { BrowserRouter, Route } from "react-router-dom";

const Main = () => {
  const [username, setUsername] = useState("");

  return (
    <BrowserRouter>
      <Route exact path="/">
        <Create setUser={setUsername} />
      </Route>
      <Route path="/:roomID">
        <Room username={username} />
      </Route>
    </BrowserRouter>
  );
};

export default Main;
