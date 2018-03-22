import './firebaseinit'
import * as firebase from 'firebase/app'
import 'firebase/database'

const gamesRef = firebase.database().ref('games');

/**
 * creates a new game and returns a reference to the game
 */
export function createNewGame(user) {
  const ref = gamesRef.push()
  ref.child('creator').set(user.uid);

  createNewQuestion(ref);
  return ref;
}

export async function createNewQuestion(gameRef) {
  const ref = gameRef.child('questions').push();
  let ranNum = await retrievePseudoRandomNumber();
  ref.child('type').set("pw");
  ref.child('answer').set(ranNum[0]);
  ref.child('question').set(ranNum[1]);
  return ref;
}

export function addPlayerToGame(gameRef, player) {
  gameRef.child('players').child(player.uid).set(player.displayName);
}

export function answerQuestion(questionRef, user, answer) {
  questionRef.child('guesses').child(user.uid).child('guess').set(answer);
}

/**
 * sets the amount the password was pwned
 */
export async function checkAnswer(answerRef, answer) {
  const count = await getPasswordCount(answer);

  answerRef.child('amount').set(count);
}

/**
 * gets the amount the password was in the breaches
 */
export function getPasswordCount(password) {
  const path = "https://api.pwnedpasswords.com/pwnedpassword/"

  return import(/* webpackChunkName: "crypto-js" */ 'crypto-js/sha1').then(sha1 => {
    let url = path + sha1(password).toString();

    return fetch(url).then(res => res.json()).catch(error => 0);
  })
}

export function getPoints(passwordCount, inputCount) {
  if (passwordCount < inputCount) {
    const a = passwordCount;
    passwordCount = inputCount;
    inputCount = a;
  }

  if (passwordCount == 0)
    return 0;

  let percentage = Math.log(1 + (inputCount / passwordCount) * (Math.E - 1));

  if (percentage < 1)
    return Math.round(100 * percentage)

  return 100;
}

export async function retrievePseudoRandomNumber() {
  let index = Math.floor(Math.random() * 9999);
  return import(/* webpackChunkName: "top10k" */"./top10k.json").then(async top10k => {
    let pw = top10k.data[index];
    return [pw, await getPasswordCount(pw)];
  });
}

export function joinGame(key, user){
  const ref = gamesRef.child(key);

  createGameListener(ref)


  addPlayerToGame(ref, user);
}