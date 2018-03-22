import {render, html} from './node_modules/lit-html/lib/lit-extended.js';

const top10k = fetch("./top10k.json").then(res => res.json());

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
  page: 'index',
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

  createNewQuestion(ref);
  return ref;
}

async function createNewQuestion(gameRef) {
  const ref = gameRef.child('questions').push();
  ref.child('type').set("pw");
  ref.child('question').set(await retrievePseudoRandomNumber());
  return ref;
}

function addPlayerToGame(gameRef, player) {
  gameRef.child('players').child(player.uid).set(player.displayName);
}

function answerQuestion(questionRef, user, answer) {
  console.log(user.uid)
  console.log(answer)
  console.log(questionRef)
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
 
function getPasswordCount(password) 
{
	const path = "https://api.pwnedpasswords.com/pwnedpassword/" 
  let url = path + CryptoJS.SHA1(password).toString(); 
	return fetch(url).then(res => res.json()).catch(error => 0);
}

function getPoints(passwordCount, inputCount)
{	
  if (passwordCount == 0)
    return 0;

  let percentage = Math.log(1 + (inputCount/passwordCount)*(Math.E-1));
  
  if (percentage < 1)
    return Math.round(100*percentage)

  return 100;
}

/**
 * creates the listeners for a game
 */
function createGameListener(gameRef) {
  // create the necessary objects if they aren't there already
  if (!state.game.questions) state.game.questions = {}
  if (!state.game.players) state.game.players = {}

  console.log(gameRef)
  console.log("HJEHAJKSHKj")

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
  
  state.game.currentQuestion = questionKey;
  state.game.questions[questionKey].ref = questionRef;

  questionRef.child('guesses').on('child_added', snap => {
    const guessKey = snap.key;
    const guessRef = snap.ref;

    // check if all objects exist
    if (!state.game.questions[questionKey].guesses[guessKey]) state.game.questions[questionKey].guesses[guessKey] = {};
    
    snap.ref.child('amount').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].amount = snap.val();
      rerender();      
    });
    
    snap.ref.child('guess').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].guess = snap.val();

      if(state.user.uid === state.game.creator){
        checkAnswer(guessRef, snap.val());
      }
      rerender();
    });
  });

  questionRef.child('question').on('value', snap => {
    console.log(snap.val())
    state.game.questions[questionKey].question = snap.val();
  });

  questionRef.child('type').on('value', snap => {
    state.game.questions[questionKey].type = snap.val();
  });

  questionRef.child('finished').on('value', snap => {
    state.game.questions[questionKey].finished = snap.val();
  });
}

async function retrievePseudoRandomNumber(){
  let index = Math.floor(Math.random() * 9999);
  return getPasswordCount((await top10k).data[index]);
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
    <a href="javascript:void(0);" on-click=${(e) => { state.page = 'imprint'; rerender() }}>Imprint</a>
</footer>`;


const renderPage = state => {
  switch(state.page){
    case 'index': return createGameTemplate(state);
    case 'question': 
      if (!state.game.questions) state.game.questions = {}
      if (!state.game.questions[state.game.currentQuestion]) state.game.questions[state.game.currentQuestion] = {}

      switch (state.game.questions[state.game.currentQuestion].type){
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
    case 'imprint': return imprintTemplate(state);
    case 'answer': return answerTemplate(state);
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

const imprintTemplate = state => html`
<div class="container">
<h1>Imprint</h1><br />
<b>Contact: MyLittlePwnage@lergin.de</b>
<h1>Credits</h1><br />
<b><a href="https://haveibeenpwned.com">HaveIBeenPwned</a></b>: Provides an useful API to check passwords.<br /><br />
<b><a href="https://github.com/danielmiessler/SecLists/blob/master/Passwords/darkweb2017-top10K.txt">Daniel Miessler</a></b>: Provided password lists.
</div>
`
const answerTemplate = state => {
  if (!state.game.questions[state.game.currentQuestion].guesses) state.game.questions[state.game.currentQuestion].guesses = {};
  if (!state.game.questions[state.game.currentQuestion].guesses[state.user.uid]) state.game.questions[state.game.currentQuestion].guesses[state.user.uid] = {};

  const guess = state.game.questions[state.game.currentQuestion].guesses[state.user.uid].guess;
  const amount = state.game.questions[state.game.currentQuestion].guesses[state.user.uid].amount;
  const questionAmount = state.game.questions[state.game.currentQuestion].question;

  return html`
  <section>
  <h1>The answer is: ${"MONKEY"}</h1>
  <h1>${"MONKEY"} was leaked ${questionAmount} times</h1>
  <h1>${guess} was leaked ${amount} times </h1>
  <h1>You gained ${getPoints(amount, questionAmount)} points</h1>
  <div class="button" on-click=${e => {
    state.page = 'leaderboard';
    rerender();
  }}>View rankings</div>
  </section>
  `
}

const enterGroupTemplate = state => html`
<input type="text" placeholder="Enter your name!" name="name" id="input-username"/><br />
<input type="text" placeholder="Enter group key!" name="groupkey" id="input-groupkey" />
<div class="button" on-click=${e => {
  const groupkey = document.getElementById('input-groupkey').value;

  createGameListener(gamesRef.child(groupkey))

  state.page = "question";
  rerender();
}}>Enter group</div>
`

const setNameTemplate = state => html`
<h1>Your group key is: </h1>
<h1>${state.game.id}</h1>
<input type="text" placeholder="Enter your name!" name="name" id="input-name" />
<div class="button" on-click=${e => {
  state.user.updateProfile({ displayName: document.getElementById("input-name").value })
  
  
  let ref = createNewGame(state.user);
  addPlayerToGame(ref, state.user);

  state.page = "question";
  rerender();
}}>Enter group</div>
`

const createMPGameTemplate = state => html`
<div class="button" on-click=${e => {
  const ref = createNewGame(state.user)
  createGameListener(ref)
  
  state.page = 'name'
  rerender();
}}>Create group</div>
<div class="button" on-click=${e => {
  state.page = "enter_group"
  rerender();
}}>Join group</div>
`

const createGameTemplate = state => html`
<img height="200" width="200" src="https://derpicdn.net/img/2013/7/6/365909/full.png" />
<h1>Ready to pwn?</h1>
<div class="button" on-click=${e => {
  if(!state.user){
    anonLogin()
  }

  let gameref = createNewGame(state.user)

  createGameListener(gameref)

  state.page = 'name';
  rerender();
}}>Singleplayer</div>
<div class="button" on-click=${e => {
  state.page = 'create_mp';
  rerender();
}}>Multiplayer</div>
`

const questionGuessAmountTemplate = state => html`
<h1>${state.game.questions[state.game.currentQuestion].question}</h1>
<input type="text" placeholder="Leaked... times" name="input" id="input-answer"/>
<div class="button" on-click=${e => {
  const answer = document.getElementById('input-answer').value;

  answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);

  state.page = 'answer';
  rerender();
}}>Submit</div>
`

const questionGuessPwTemplate = state => html`
<h1>${state.game.questions[state.game.currentQuestion].question}</h1>
<input type="text" placeholder="Guess password!" name="input" id="input-answer" />
<div class="button" on-click=${e => {
  const answer = document.getElementById('input-answer').value;

  answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);

  state.page = 'answer';
  rerender();
}}>Submit</div>
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

window.getPasswordCount = getPasswordCount;
window.getPoints = getPoints;
