import {render, html} from './node_modules/lit-html/lib/lit-extended.js'


const db = firebase.database();
const auth = firebase.auth();

const gamesRef = db.ref('games');

const state = {
  test: 'HELLO WORLD',
  // will be set by the login
  /*user: {
    uid: '',
    // only available if not anonymous
    displayName: '',
    photoURL: '',
    // true if anonymous
    isAnonymous: ''
  },*/
  // the current game currently only set by createNewGame()
  game: {},
  currentQuestion: {
    question: '123400',
    type: 'pw'
  },
  page: 'question',
  players: {
    a: {
      displayName: "Malte",
      points: 123
    },
    b: {
      displayName: "Tom",
      points: 312
    }
  },
  isCreator: true
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
	let xhttp = new XMLHttpRequest();
    
    let url = path + password; 
    
    xhttp.open("GET", url, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
    
    let response = JSON.parse(xhttp.responseText);
    
	return response; 
}

/**
 * creates the listeners for a game
 */
function createGameListener(gameRef) {
  // create the necessary objects if they aren't there already
  if (!state.game.questions) state.game.questions = {}
  if (!state.game.players) state.game.players = {}

  state.game.id = gameRef.key;

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

function createRandomPwAmount() {
  return '4' // TODO
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
    state.user = user;
    state.game.ref = createNewGame(state.user);
    createGameListener(state.game.ref);
  } else {
    console.log('logout')
  }

  rerender()
  
});

const gameTemplate = (state) => html`
<header>
    <div>
        <img height="40" width="40" src="https://derpicdn.net/img/2013/7/6/365909/full.png" title="MyLittlePwnage" />
    </div>
    <div>
        <img height="40" width="40" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScr6GOuixbVi-Sn8Oodr4756CSEdd0YZsUykSvDwficCRMkaxE-g" />
    </div>
    <div>
        <img height="40" width="40" src="http://files.softicons.com/download/social-media-icons/flat-social-media-icons-by-uiconstock/png/512x512/twitter2.png" />
    </div>
    <div>
        <img height="40" width="40" src="http://files.softicons.com/download/social-media-icons/flat-gradient-social-icons-by-guilherme-lima/ico/Reddit.ico" />
    </div>
</header>
<main>
    <section>
        ${renderPage(state)}
    </section>
</main>
<footer>
    <a href="#">Imprint</a>
    <a href="#">Credits</a>
    <a href="#">Contact</a>
</footer>`;


const renderPage = state => {
  switch(state.page){
    case 'index': return createGameTemplate(state);
    case 'question': 
      switch(state.currentQuestion.type){
        case 'pw': return questionGuessPwTemplate(state);
        case 'amount': return questionGuessAmountTemplate(state);
      }
      break;
    case 'create_mp': return createMPGameTemplate(state);
    case 'name': return setNameTemplate(state);
    case 'enter_group': return enterGroupTemplate(state);
    case 'waiting': return waitingTemplate(state);
    case 'leaderboard': return leaderboardTemplate(state);
    case 'win': return winTemplate(state);
  }
}

const winTemplate = (state) => html`
<h1>${Object.values(state.players).sort((a, b) => b.points - a.points)[0].displayName} wins!</h1>
<img src="https://media3.giphy.com/media/SRO0ZwmImic0/giphy.gif" />
<div class="button">New game</div>`

const leaderboardTemplate = state => html`
<h1>TOP H4ck3r:</h1>
<table>
    <thead>
        <tr>
            <td>Name</td>
            <td>Points</td>
        </tr>
    </thead>
    <tbody>
      ${Object.values(state.players).sort((a,b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
    </tbody>
</table>
<div class="button" on-click=${(e) => { state.page = 'question'; if (state.isCreator) { createNewQuestion(state.game.ref)} }}>Next round</div>
`

const lederboardItemTemplate = (user) => html`
<tr>
    <td>${user.displayName}</td>
    <td>${user.points}</td>
</tr>
`

const waitingTemplate = state => html`
<!-- TODO: Random gifs here -->
<img src="https://media.giphy.com/media/LiWsL77P4tA9a/giphy.gif" />
<h1>Waiting for players...</h1>
`

const enterGroupTemplate = state => html`
<input type="text" placeholder="Enter your name!" name="name" id="input-username"/><br />
<input type="text" placeholder="Enter group key!" name="groupkey" id="input-groupkey" />
<div class="button" on-click=${e => {
  const groupkey = document.getElementById('input-groupkey').value;

  console.log(groupkey)

  createGameListener(gamesRef.child(groupkey))
}}>Enter group</div>
`

const setNameTemplate = state => html`
<h1>Your group key is: </h1>
<h1>${state.game.id}</h1>
<input type="text" placeholder="Enter your name!" name="name" />
<div class="button">Enter group</div>
`

const createMPGameTemplate = state => html`
<div class="button">Create group</div>
<div class="button">Join group</div>
`

const createGameTemplate = state => html`
<img height="200" width="200" src="https://derpicdn.net/img/2013/7/6/365909/full.png" />
<h1>Ready to pwn?</h1>
<div class="button">Singleplayer</div>
<div class="button">Multiplayer</div>
`

const questionGuessAmountTemplate = state => html`
<h1>${state.currentQuestion.question}</h1>
<input type="text" placeholder="Leaked... times" name="input" />
<div class="button">Submit</div>
`

const questionGuessPwTemplate = state => html`
<h1>${state.currentQuestion.question}</h1>
<input type="text" placeholder="Guess password!" name="input" />
<div class="button">Submit</div>
`

function rerender(){
  render(gameTemplate(state), document.body)
}

console.log("RENDERED")

// if noone is logged in show the login stuff
if (!state.user) {
  anonLogin();
}

rerender()

window.state = state;
window.rerender = rerender;

