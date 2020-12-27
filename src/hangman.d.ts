/// <reference types="@types/hangman" />

export as namespace hangman;

export interface gameInitInterface {
  category: string;
  username: string;
  word: string;
}

export interface gameStateInterface {
  players: string[];
  hanger: string;
  category: string;
  word: string;
  guessedLetters: boolean[];
  numIncorrect: number;
  guessedWords: string[];
  guesser: string;
  curGuess: string;
  guessedWord: string;
  gameStart: bool;
}
