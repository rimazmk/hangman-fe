import React, { useRef } from "react";
import { gameStateInterface } from "../hangman";
import NewRound from "./NewRound";

const Standings = ({
  gameState,
  roomID,
  user,
}: {
  gameState: gameStateInterface;
  roomID: string;
  user: string;
}) => {
  const standings = useRef<string[]>([]);

  const places = [
    "FIRST",
    "SECOND",
    "THIRD",
    "FOURTH",
    "FIFTH",
    "SIXTH",
    "SEVENTH",
    "EIGTH",
  ];

  if (!standings.current.length) {
    let wins = Object.entries(gameState.wins);
    wins.sort(function (a, b) {
      return b[1] - a[1];
    });
    let prev = wins[0][1];
    let uniq = 0;
    let res: Array<string> = [];
    for (let person of wins) {
      if (person[1] !== prev) {
        uniq++;
      }
      prev = person[1];
      let str = `${places[uniq]} PLACE: ${person[0]} with a score of ${person[1]}`;
      res.push(str);
    }

    standings.current = res;
  }

  return (
    <div>
      {standings.current.map((place: string) => (
        <p key={place}>{place}</p>
      ))}

      <NewRound gameState={gameState} roomID={roomID} user={user} />
    </div>
  );
};

export default Standings;
