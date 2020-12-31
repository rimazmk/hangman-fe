import React from "react";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  guessedLetters: string[];
}

const Letters = ({ onClick, disabled, guessedLetters }: Props) => {
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
      return (
        <button
          onClick={onClick}
          value={letter}
          key={letter.charCodeAt(0)}
          disabled={disabled || guessedLetters.includes(letter)}
        >
          {letter}
        </button>
      );
    });
  };

  return <>{renderLetters()}</>;
};

export default Letters;
