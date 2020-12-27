import React, { useState, useEffect } from "react";
import { gameInitInterface, gameStateInterface } from "../hangman";
import logo from "../logo.svg";
import "../css/App.css";
import Letters from "./Letters";
import io from "socket.io-client";
import axios from "axios";
import { stat } from "fs";

function Game({
  gameState,
  user,
  roomID,
}: {
  gameState: gameStateInterface;
  user: string;
  roomID: string;
}) {
  // get initial game state, user, roomID as prop
  // <Game gameState={gameState} />

  return <div></div>;
}

export default Game;
