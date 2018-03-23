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

  state.hackLastQuestion = 0;
  
  state.rounds = 0;
  state.user.updateProfile({ displayName: '' })
  
  createNewQuestion(ref);
  
  return ref;
}

export async function createNewQuestion(gameRef) {
  const ref = gameRef.child('questions').push();
  
  if (state.mode === 0){
    ref.child('type').set("pw");
  } else {
    ref.child('type').set("amount");
  }

  const ranNum = await retrievePseudoRandomNumber();
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

export function playerReady(questionRef, user) {
  questionRef.child('guesses').child(user.uid).child('ready').set(42);
}

/**
 * sets the amount the password was pwned
 */
export async function checkAnswer(answerRef, answer) {
  let count = 0;
  if (state.mode === 0){
    count = await getPasswordCount(answer);
  } else if (answer !== null && answer.length > 0 && !isNaN(answer)) {
    count = parseInt(answer);
  }

  answerRef.child('amount').set(count);
}

/**
 * gets the amount the password was in the breaches
 */
export function getPasswordCount(password) {
  const path = "https://api.pwnedpasswords.com/pwnedpassword/"

  return import(/* webpackChunkName: "crypto-js" */ 'crypto-js/sha1').then(sha1 => {
    let url = path + sha1.default(password).toString();

    return fetch(url).then(res => res.json()).catch(error => 0);
  })
}

export function getPoints(passwordCount, inputCount) {
  if (passwordCount < inputCount) {
    const a = passwordCount;
    passwordCount = inputCount;
    inputCount = a;
  }

  if (passwordCount == 0){
    return 0;
  }

  let percentage = Math.log(1 + (inputCount / passwordCount) * (Math.E - 1));

  if (percentage < 1){
    return Math.round(100 * percentage)
  }

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