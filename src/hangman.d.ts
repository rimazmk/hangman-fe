/// <reference types="@types/hangman" />

export as namespace hangman;

export interface gameInitInterface {
  category: string;
  username: string;
  word: string;
  lives: string;
}

export interface gameStateInterface {
  players: string[];
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
}
