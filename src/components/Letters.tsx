import React from "react";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  guessedLetters: string[];
}

const Letters = ({ onClick, disabled, guessedLetters }: Props) => {
  let letters = "abcdefghijklmnopqrstuvwxyz".split("");

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
