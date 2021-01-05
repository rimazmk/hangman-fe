/// <reference types="@types/hangman" />

export as namespace hangman;

export interface gameInitInterface {
  username: string;
  lives: string;
  numrounds: string;
  rotation: string;
}

export interface gameStateInterface {
  players: string[];
  wins: object;
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
  numrounds: number;
}
