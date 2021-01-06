import React from "react";
import { gameStateInterface } from "../hangman";

const Standings = ({ gameState }: { gameState: gameStateInterface }) => {
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

  return (
    <div>
      {res.map((place: string) => (
        <p key={place}>{place}</p>
      ))}
    </div>
  );
};

export default Standings;
