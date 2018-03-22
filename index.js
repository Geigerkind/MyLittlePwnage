const db = firebase.database();
const auth = firebase.auth();

const gamesRef = db.ref('games');

const state = {
  // will be set by the login
  user: {
    uid: '',
    // only available if not anonymous
    displayName: '',
    photoURL: '',
    // true if anonymous
    isAnonymous: ''
  },
  // the current game currently only set by createNewGame()
  game: {}
}

/**
 * creates a new game and returns a reference to the game
 */
function createNewGame(user) {
  const ref = gamesRef.push()
  ref.child('creator').set(user.uid);
  return ref;
}

function createNewQuestion(gameRef) {
  const ref = gameRef.child('questions').push();
  ref.child('question').set(createRandomPwAmount());
  return ref;
}

function answerQuestion(questionRef, user, answer) {
  questionRef.child('guesses').child(user.uid).child('guess').set(answer);
}

/**
 * sets the amount the password was pwned
 */
async function checkAnswer(answerRef, answer) {
  const count = await getPasswordCount(answer);
  
  answerRef.child('amount').set(count);
}

/**
 * gets the amount the password was in the breaches
 */
async function getPasswordCount(password) {
  const hash = password; // TODO

  const res = await fetch(`https://api.pwnedpasswords.com/range/${hash.substr(0, 5)}`).then(res => res.text())

  // TODO
  return 1;
}

/**
 * creates the listeners for a game
 */
function createGameListener(gameRef) {
  // create the necessary objects if they aren't there already
  if (!state.game.questions) state.game.questions = {}
  if (!state.game.players) state.game.players = {}

  gameRef.child('questions').on('child_added', snap => {
    state.game.questions[snap.key] = snap.val();
    createQuestionListeners(snap.ref, snap.key);
  })

  gameRef.child('players').on('child_added', snap => {
    state.game.players.push({
      name: snap.val(),
      uid: snap.key
    });
  })

  gameRef.child('finished').on('value', snap => {
    state.game.finished = snap.val();
  })

  gameRef.child('creator').on('value', snap => {
    state.game.creator = snap.val();
  })
}

function createQuestionListeners(questionRef, questionKey){
  // check if all objects exist
  if (!state.game.questions[questionKey].guesses) state.game.questions[questionKey].guesses = {};
  
  questionRef.child('guesses').on('child_added', snap => {
    const guessKey = snap.key;
    const guessRef = snap.ref;

    // check if all objects exist
    if (!state.game.questions[questionKey].guesses[guessKey]) state.game.questions[questionKey].guesses[guessKey] = {};
    
    snap.ref.child('answer').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].answer = snap.val();
    });
    
    snap.ref.child('guess').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].guess = snap.val();

      if(state.user.uid === state.game.creator){
        checkAnswer(guessRef, snap.val());
      }
    });
  });
  
  questionRef.child('question').on('value', snap => {
    state.game.questions[questionKey].question = snap.val();
  });
  
  questionRef.child('finished').on('value', snap => {
    state.game.questions[questionKey].finished = snap.val();
  });
}

function createRandomPwAmount(){
  return 42;
}

/**
 * shows the login panel
 */
function login(){
  const ui = new firebaseui.auth.AuthUI(firebase.auth());

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: 'localhost:5000',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  };

  ui.start('#firebaseui-auth-container', uiConfig);
}

/**
 * anonymous login
 */
function anonLogin() {
  firebase.auth().signInAnonymously();
}

function logout() {
  firebase.auth().signOut();
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log(user)
    state.user = user;
    state.game.ref = createNewGame(state.user);
    createGameListener(state.game.ref);
  } else {
    console.log('logout')
  }
});

// if noone is logged in show the login stuff
if(!state.user){
  login();
}


