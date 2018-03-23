import { rerender } from './render';
import { getPoints, checkAnswer } from './logic';
import { Game } from './Game';

const gamesRef = firebase.database().ref('games');

export const state = {
  game: {
    players: []
  },
  page: 'index',
  players: [],
  rounds: 0,
  mode: 0,
  maxRounds: 10,
  hackLastQuestion: 0,
  gamesRef: gamesRef,
  isCreator: () => state.user.uid === game.creator
}

/**
 * creates the listeners for a game
 */
export function createGameListener(gameRef) {
  state.game = new Game(gameRef);
}