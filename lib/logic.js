import './firebaseinit'
import * as firebase from 'firebase/app'
import 'firebase/database'
import { rerender } from './render';
import { Game } from './Game';

const gamesRef = firebase.database().ref('games');

/**
 * creates a new game
 */
export function createNewGame(user) {
  state.game = new Game(gamesRef.push());

  state.game.mode = state.mode;
  state.game.create(user);

  state.game.newQuestion();
}

export function createNewQuestion() {
  state.game.newQuestion();
}

export function addPlayerToGame(gameRef, player) {
  gameRef.child('players').child(player.uid).set(player.displayName);
}

export function answerQuestion(questionRef, user, answer) {
  questionRef.child('guesses').child(user.uid).child('guess').set(answer);
}

export function playerReady(questionRef, user) {
  questionRef.child('guesses').child(user.uid).child('ready').set(42);
}

/**
 * gets the amount the password was in the breaches
 */
export function getPasswordCount(password) {
  const path = "https://api.pwnedpasswords.com/range/"

  return import(/* webpackChunkName: "crypto-js" */ 'crypto-js/sha1').then(sha1 => {
    const hash = sha1.default(password).toString().toUpperCase();
    const prefix = hash.substr(0, 5);
    const suffix = hash.substr(5);

    const url = path + hash.substr(0, 5);

    return fetch(url)
      .then(res => res.text())
      .then(res => res.split(/\n/g))
      .then(res => res.find(h => h.substr(0, 35) === suffix))
      .then(res => res ? parseInt(res.substr(36)) : 0)
  });
}

export async function retrievePseudoRandomNumber() {
  return import(/* webpackChunkName: "passwords" */"./passwords.json").then(async passwords => {
    const index = Math.floor(Math.random() * passwords.data.length);
    const pw = passwords.data[index];
    return [pw, await getPasswordCount(pw)];
  });
}

export function joinGame(key, user){
  state.game = new Game(gamesRef.child(key));

  user.points = 0;
  state.game.addPlayer(user);
}

export function openGame(key){
  state.game = new Game(gamesRef.child(key));
}