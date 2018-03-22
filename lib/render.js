import { render, html } from 'lit-html/lib/lit-extended.js';
import { createNewQuestion, addPlayerToGame, createNewGame, answerQuestion, joinGame, getPoints } from "./logic";
import { anonLogin } from "./login";
import { state, createGameListener } from './state';

import titleImg from './img/party_hard_by_wolferahm-d6c8oge.png';

const gameTemplate = (state) => html`
<header>
    <div>
        <img height="40" width="40" src="${titleImg}" title="MyLittlePwnage" />
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
  switch (state.page) {
    case 'index': return createGameTemplate(state);
    case 'question':
      if (!state.game.questions) state.game.questions = {}
      if (!state.game.questions[state.game.currentQuestion]) state.game.questions[state.game.currentQuestion] = {}

      switch (state.game.questions[state.game.currentQuestion].type) {
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

const winTemplate = (state) => html`
<h1>${state.game.players.length > 0 ? Object.values(state.game.players).sort((a, b) => b.points - a.points)[0].displayName:'?'} wins!</h1>
<video muted autoplay loop crossorigin="anonymous" src="https://media.giphy.com/media/SRO0ZwmImic0/giphy.mp4"></video>

<div class="button" on-click=${(e) => { state.page = 'index'; }}>New game</div>`

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
      ${Object.values(state.game.players).sort((a, b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
    </tbody>
</table>
<div class="button" on-click=${(e) => {
    state.page = 'question';

    if (state.isCreator) {
      createNewQuestion(state.game.ref)
    }

    rerender()
  }}>Next round</div>
`

const lederboardItemTemplate = (user) => html`
<tr>
    <td>${user.displayName}</td>
    <td>${user.points}</td>
</tr>
`

const waitingTemplate = state => html`
<!-- TODO: Random gifs here -->
<video muted autoplay loop crossorigin="anonymous" src="https://media.giphy.com/media/LiWsL77P4tA9a/giphy.mp4"></video>
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

  return html`
  <section>
  <h1>The answer is: ${answerPlain}</h1>
  <h1>${answerPlain} was leaked ${questionAmount} times</h1>
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
    state.user.updateProfile({ displayName: document.getElementById("input-username").value })

    joinGame(groupkey, state.user);

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


    addPlayerToGame(state.game.ref, state.user);

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
<img height="200" width="200" src="${titleImg}" />
<h1>Ready to pwn?</h1>
<div class="button" on-click=${e => {
    if (!state.user) {
      anonLogin().then(_ => {
        let gameref = createNewGame(state.user)

        createGameListener(gameref)

        state.page = 'name';
        rerender();
      })
    }else {
      let gameref = createNewGame(state.user)

      createGameListener(gameref)

      state.page = 'name';
      rerender();
    }
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

export function rerender() {
  render(gameTemplate(state), document.body)
}
