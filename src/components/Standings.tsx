import React, { useRef } from "react";
import { gameStateInterface } from "../hangman";

const Standings = ({ gameState }: { gameState: gameStateInterface }) => {
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

  const getScore = (player: string) => {
    const win: number = 30;
    const right: number = 15;
    const wrong: number = -5;
    const miss: number = -5;

    return (
      win * gameState.wins[player] +
      right * gameState.right[player] +
      wrong * gameState.wrong[player] +
      miss * gameState.misses[player]
    );
  };

  let scores: { [key: string]: number } = gameState.players.reduce(function (
    obj: { [key: string]: number },
    x: string
  ) {
    obj[x] = getScore(x);
    return obj;
  },
  {});

  if (!standings.current.length) {
    // let wins = Object.entries(gameState.wins);
    let wins = Object.entries(scores);
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
    </div>
  );
};

export default Standings;
