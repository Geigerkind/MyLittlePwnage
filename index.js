import {render, html} from './node_modules/lit-html/lib/lit-extended.js';

const top10k = fetch("./top10k.json").then(res => res.json());

const db = firebase.database();
const auth = firebase.auth();

const gamesRef = db.ref('games');

const state = {
  // the current game currently only set by createNewGame()
  game: {},
  page: 'index',
  players: [],
  isCreator: () => state.user.uid === game.creator
}

/**
 * creates a new game and returns a reference to the game
 */
function createNewGame(user) {
  const ref = gamesRef.push()
  ref.child('creator').set(user.uid);
  hackLastQuestion = 0;
  createNewQuestion(ref);
  return ref;
}

async function createNewQuestion(gameRef) {
  const ref = gameRef.child('questions').push();
  let ranNum = await retrievePseudoRandomNumber();
  ref.child('type').set("pw");
  ref.child('answer').set(ranNum[0]);
  ref.child('question').set(ranNum[1]);
  return ref;
}

function addPlayerToGame(gameRef, player) {
  console.log(player.displayName)

  gameRef.child('players').child(player.uid).set(player.displayName);
}

function answerQuestion(questionRef, user, answer) {
  questionRef.child('guesses').child(user.uid).child('guess').set(answer);
}

function playerReady(questionRef, user) {
  questionRef.child('guesses').child(user.uid).child('ready').set(42);
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
function getPasswordCount(password) {
	const path = "https://api.pwnedpasswords.com/pwnedpassword/" 
  let url = path + CryptoJS.SHA1(password).toString(); 
	return fetch(url).then(res => res.json()).catch(error => 0);
}

function getPoints(passwordCount, inputCount)
{	
  if(passwordCount < inputCount) {
    const a = passwordCount;
    passwordCount = inputCount;
    inputCount = a;
  }

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
  if (!state.game.players) state.game.players = []

  state.game.id = gameRef.key;

  gameRef.child('questions').on('child_added', snap => {
    if (state.page === 'leaderboard')
      state.page = 'question';

    state.game.questions[snap.key] = snap.val();
    createQuestionListeners(snap.ref, snap.key);
  });

  gameRef.child('players').on('child_added', snap => {
    console.log(snap.val());
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

      let pl = state.game.players.find(a => a.uid === guessKey);
      
      if(pl){
        pl.points += getPoints(state.game.questions[state.game.currentQuestion].question, snap.val())
      }

      rerender();      
    });
    
    snap.ref.child('guess').on('value', snap => {
      state.game.questions[questionKey].guesses[guessKey].guess = snap.val();

      if(state.user.uid === state.game.creator){
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
  });

  questionRef.child('finished').on('value', snap => {
    state.game.questions[questionKey].finished = snap.val();
  });
}

async function retrievePseudoRandomNumber(){
  let index = Math.floor(Math.random() * 9999);
  let pw = (await top10k).data[index];
  return [pw, await getPasswordCount(pw)];
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
    case 'loading': return loadingTemplate(state);
  }
}

var hackLastQuestion = 0;
const winTemplate = (state) => html`
<h1>${Object.values(state.game.players).sort((a, b) => b.points - a.points)[0].displayName} wins!</h1>
<img src="https://media3.giphy.com/media/SRO0ZwmImic0/giphy.gif" />
<div class="button" on-click=${(e) => { state.page = 'index'; }}>New game</div>`

const leaderboardTemplate = state => {
  let rdy = true;
  state.game.players.forEach(element => {
    if (state.game.questions[state.game.currentQuestion].guesses[element.uid] === undefined 
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready === undefined
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready !== 42
    )
    {
      rdy = false;
    }
    if (hackLastQuestion !== 0 && hackLastQuestion !== state.game.currentQuestion)
      rdy = true;
  });

if (!rdy)
  return html`
<h1>TOP H4ck3r:</h1>
<table>
    <thead>
        <tr>
            <td>Name</td>
            <td>Guess</td>
            <td>Points</td>
        </tr>
    </thead>
    <tbody>
      ${Object.values(state.game.players).sort((a,b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
    </tbody>
</table>
<img width="100" height="100" src="https://m.popkey.co/fe4ba7/DYALX.gif" />`
  else
  {
    hackLastQuestion = state.game.currentQuestion;
  return html`
<h1>TOP H4ck3r:</h1>
<table>
    <thead>
        <tr>
            <td>Name</td>
            <td>Guess</td>
            <td>Points</td>
        </tr>
    </thead>
    <tbody>
      ${Object.values(state.game.players).sort((a,b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
    </tbody>
</table>
<div class="button" on-click=${(e) => {
  state.page = 'question';
  
  if (state.isCreator) {
    createNewQuestion(gamesRef.child(state.game.id))
  }

  rerender()
}}>Next round</div>
`}}

const lederboardItemTemplate = (user) => {
  if (state.game.questions[state.game.currentQuestion].guesses[user.uid] === undefined)
    return html`
    <tr>
        <td>${user.displayName}</td>
        <td></td>
        <td>${user.points}</td>
    </tr>
    `
return html`
<tr>
    <td>${user.displayName}</td>
    <td>${state.game.questions[state.game.currentQuestion].guesses[user.uid].guess}</td>
    <td>${user.points}</td>
</tr>
`}

const waitingTemplate = state => html`
<!-- TODO: Random gifs here -->
<img src="https://media.giphy.com/media/LiWsL77P4tA9a/giphy.gif" />
<h1>Waiting for players...</h1>
`

const loadingTemplate = state => html`
<img width="200" height="200" src="https://m.popkey.co/fe4ba7/DYALX.gif" />
<h1>Loading...</h1>
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
  const answerPlain = state.game.questions[state.game.currentQuestion].answer;

  if (!amount)
    return html`<section><img width="200" height="200" src="https://m.popkey.co/fe4ba7/DYALX.gif" /></section>`
  return html`
  <section>
  <h1>The answer is: ${answerPlain}</h1>
  <h1>${answerPlain} was leaked ${questionAmount} times</h1>
  <h1>${guess} was leaked ${amount} times </h1>
  <h1>You gained ${getPoints(amount, questionAmount)} points</h1>
  <div class="button" on-click=${e => {
    state.game.questions[state.game.currentQuestion].Done = true;
    state.page = 'leaderboard';
    playerReady(state.game.questions[state.game.currentQuestion].ref, state.user)
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

  state.user.updateProfile({ displayName: document.getElementById("input-username").value })
  
  addPlayerToGame(gamesRef.child(state.game.id), state.user);

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
  
  addPlayerToGame(gamesRef.child(state.game.id), state.user);

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

const questionGuessPwTemplate = state => {
if (state.game.questions[state.game.currentQuestion].Done === true)
  return html`<section><img width="200" height="200" src="https://m.popkey.co/fe4ba7/DYALX.gif" /></section>`  
return html`
<h1>${state.game.questions[state.game.currentQuestion].question }</h1>
<input type="text" placeholder="Guess password!" name="input" id="input-answer" />
<div class="button" on-click=${e => {
  const answer = document.getElementById('input-answer').value;

  answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);

  state.page = 'answer';
  rerender();
}}>Submit</div>
`}

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
