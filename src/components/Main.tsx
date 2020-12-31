import React, { useState, useEffect } from "react";
import axios from "axios";
import Create from "./Create";
import Room from "./Room";
// import { Router, Route, Redirect, useLocation } from "react-router";
// import { createBrowserHistory } from "history";

// const useQuery = (): URLSearchParams => {
//   return new URLSearchParams(useLocation().search);
// };

// const history = createBrowserHistory();

const Main = () => {
  const [roomID, setRoomID] = useState("");
  const [username, setUsername] = useState("");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("roomID");
  // console.log(params, id, window.location, window.location.search);

  useEffect(() => {
    const checkRoomID = async () => {
      let res = await axios.get(`http://localhost:5000/?roomID=${id}`);
      // console.log(id);
      if (res.status === 200) setRoomID(id!);
    };

    checkRoomID();
  }, []);

  // TODO: replace with react router
  return (
    <div>
      {roomID !== "" ? (
        <Room username={username} roomID={roomID} />
      ) : (
        <Create setUser={setUsername} setRoom={setRoomID} />
      )}
    </div>
  );
};

export default Main;
