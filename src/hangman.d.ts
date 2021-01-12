/// <reference types="@types/hangman" />

export as namespace hangman;

export interface gameInitInterface {
  username: string;
  lives: string;
  numRounds: string;
  rotation: string;
  time: string;
}

export interface gameStateInterface {
  players: string[];
  wins: { [key: string]: number };
  right: { [key: string]: number };
  wrong: { [key: string]: number };
  misses: { [key: string]: number };
  cap: number;
  hanger: string;
  category: string;
  word: string;
  guessedLetters: string[];
  lives: number;
  numIncorrect: number;
  guessedWords: string[];
  guesser: string;
  curGuess: string;
  guessedWord: string;
  gameStart: bool;
  rotation: string;
  round: number;
  numRounds: number;
  time: number;
}
