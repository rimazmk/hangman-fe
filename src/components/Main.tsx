import React, { useState, useEffect } from "react";
import axios from "axios";
import Create from "./Create";
import Room from "./Room";
import { Router, Route, Redirect, useLocation } from "react-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const Main = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("roomID");

  useEffect(() => {
    const checkRoomID = async () => {
      let res = await axios.get(`http://localhost:5000/?roomID=${id}`);
      if (res.status === 200) setRoomID(id!);
    };

    checkRoomID();
  }, [id]);

  // TODO: replace with react router
  return (
    <Router history={history}>
      <Route exact path="/">
        <Create setUser={setUsername} />
      </Route>
      <Route path="/:roomID">
        <Room username={username} />
      </Route>
      {/* {roomID !== "" ? (
        <Room username={username} roomID={roomID} />
      ) : (
        <Create setUser={setUsername} setRoom={setRoomID} />
      )} */}
    </Router>
  );
};

export default Main;
