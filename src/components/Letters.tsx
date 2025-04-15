import React from "react";
import { Button } from "@mui/material";

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
        <Button
          variant="contained"
          onClick={onClick}
          value={letter}
          key={letter.charCodeAt(0)}
          size="small"
          color="primary"
          style={{ maxWidth: "30px", minWidth: "30px", margin: "3px" }}
          disabled={disabled || guessedLetters.includes(letter)}
        >
          {letter}
        </Button>
      );
    });
  };

  return <div style={{ textAlign: "center" }}>{renderLetters()}</div>;
};
export default Letters;
