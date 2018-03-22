import { rerender } from './render';
import { getPoints, checkAnswer } from './logic';

export const state = {
  // the current game currently only set by createNewGame()
  game: {
    players: []
  },
  page: 'index',
  players: [],
  rounds: 0,
  mode: 0,
  maxRounds: 10,
  hackLastQuestion: 0,
  isCreator: () => state.user.uid === game.creator
}

/**
 * creates the listeners for a game
 */
export function createGameListener(gameRef) {
  // create the necessary objects if they aren't there already
  if (!state.game.questions) state.game.questions = {}
  if (!state.game.players) state.game.players = []

  state.game.id = gameRef.key;
  state.game.ref = gameRef

  gameRef.child('questions').on('child_added', snap => {
    if (state.page === 'leaderboard') {
      ++state.rounds;
      state.page = 'question';
    }

    state.game.questions[snap.key] = snap.val();
    createQuestionListeners(snap.ref, snap.key);
  });

  gameRef.child('players').on('child_added', snap => {
    state.game.players.push({
      displayName: snap.val(),
      uid: snap.key,
      points: 0
    });
  });

  gameRef.child('finished').on('value', snap => {
    state.game.finished = snap.val();
  });

  gameRef.child('creator').on('value', snap => {
    state.game.creator = snap.val();
  });
}

export function createQuestionListeners(questionRef, questionKey) {
  // check if all objects exist
  if (!state.game.questions[questionKey].guesses) state.game.questions[questionKey].guesses = {};

  state.game.currentQuestion = questionKey;
  state.game.questions[questionKey].ref = questionRef;

  questionRef.child('guesses').on('child_added', snap => {
    const guessKey = snap.key;
    const guessRef = snap.ref;

    // check if all objects exist
    if (!state.game.questions[questionKey].guesses[guessKey]) state.game.questions[questionKey].guesses[guessKey] = {};

    snap.ref.child('amount').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].amount = snap.val();

      let pl = state.game.players.find(a => a.uid === guessKey);

      if (pl) {
        pl.points += getPoints(state.game.questions[state.game.currentQuestion].question, snap.val())
      }

      rerender();
    });

    snap.ref.child('guess').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].guess = snap.val();

      if (state.user.uid === state.game.creator) {
        checkAnswer(guessRef, snap.val());
      }
      rerender();
    });

    snap.ref.child('ready').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].ready = snap.val();
      rerender();
    });
  });

  questionRef.child('question').on('value', snap => {
    state.game.questions[questionKey].question = snap.val();
    rerender()
  });

  questionRef.child('answer').on('value', snap => {
    state.game.questions[questionKey].answer = snap.val();
  });

  questionRef.child('type').on('value', snap => {
    state.game.questions[questionKey].type = snap.val();

    if (state.game.questions[questionKey].type === "pw"){
      state.mode = 0;
    } else {
      state.mode = 1;
    }

    rerender()   
  });

  questionRef.child('finished').on('value', snap => {
    state.game.questions[questionKey].finished = snap.val();
  });
}