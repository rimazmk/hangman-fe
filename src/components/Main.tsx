import React, { useState, useEffect } from "react";
import axios from "axios";
import Create from "./Create";
import Room from "./Room";
import { Route, Redirect, useLocation } from "react-router";
import { BrowserRouter } from "react-router-dom";

const Main = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("roomID");

  useEffect(() => {
    console.log(window.location.href);
  });

  useEffect(() => {
    const checkRoomID = async () => {
      let res = await axios.get(`http://localhost:5000/?roomID=${id}`);
      if (res.status === 200) setRoomID(id!);
    };

    checkRoomID();
  }, [id]);

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
