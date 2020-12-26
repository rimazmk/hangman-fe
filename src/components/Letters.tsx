import React from "react";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const Letters = ({ onClick }: Props) => {
  let letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  const renderLetters = () => {
    return letters.map((letter) => {
      return <button onClick={onClick}>{letter}</button>;
    });
  };

  return <>{renderLetters()}</>;
};

export default Letters;
