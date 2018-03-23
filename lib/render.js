import { render, html } from 'lit-html/lib/lit-extended.js';
import { createNewQuestion, addPlayerToGame, createNewGame, answerQuestion, joinGame, getPoints, playerReady } from "./logic";
import { anonLogin } from "./login";
import { state, createGameListener } from './state';

import titleImg from './img/party_hard_by_wolferahm-d6c8oge.png';

const winningGifs = [
  "https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.mp4",
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.mp4",
  "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.mp4",
  "https://media.giphy.com/media/3o6fIUZTTDl0IDjbZS/giphy.mp4",
  "https://media.giphy.com/media/xHMIDAy1qkzNS/giphy.mp4",
  "https://media.giphy.com/media/DKnMqdm9i980E/giphy.mp4",
  "https://media.giphy.com/media/3o7TKJhBfNCiispgDm/giphy.mp4",
  "https://media.giphy.com/media/cQNRp4QA8z7B6/giphy.mp4",
  "https://media.giphy.com/media/K3RxMSrERT8iI/giphy.mp4",
  "https://media.giphy.com/media/RWFpHUbc6s492/giphy.mp4",
  "https://media.giphy.com/media/3NtY188QaxDdC/giphy.mp4",
  "https://media.giphy.com/media/rjkJD1v80CjYs/giphy.mp4",
  "https://media.giphy.com/media/DYH297XiCS2Ck/giphy.mp4",
  "https://media.giphy.com/media/l4hLwMmFVBOAKF3EI/giphy.mp4",
  "https://media3.giphy.com/media/SRO0ZwmImic0/giphy.mp4"
];

const trivia = [
  "A long concatination of words that you can remember easily has a better cryptographic strength than a short password with mixed symbols",
  "Forced frequent password changes weaken the choice of passwords",
  "Uniform random passwords are hard to remember, why not let the user choose them?",
  "Nist recommends: No password expiry without a reason",
  "Nist recommends: Longer passwords have a higher cryptographic strength than complex short ones",
  "Nist recommends: Passwords should have at least 8 characters",
  "Nist recommends: Use password managers, if you can",
  html`Avoid commonly used passwords. Check your choice at <a href=\"https://haveibeenpwned.com/Passwords\">HaveIBeenPwned</a>!`,
];

const gameTemplate = (state) => html`
<header>
    <div>
      <a href="/">
        <img height="40" width="40" src="${titleImg}" title="MyLittlePwnage" />
      </a>
    </div>
    <div id="title">MyLittlePwnage</div>
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

      switch (state.mode) {
        case 0: return questionGuessPwTemplate(state);
        case 1: return questionGuessAmountTemplate(state);
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
<video muted autoplay loop crossorigin="anonymous" src="${winningGifs[Math.floor(Math.random() * 14)]}"></video>

<div class="button" on-click=${(e) => { state.page = 'index'; rerender(); }}>New game</div>`


const leaderboardTemplate = state => {
  let rdy = true;
  state.game.players.forEach(element => {
    if (state.game.questions[state.game.currentQuestion].guesses[element.uid] === undefined
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready === undefined
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready !== 42
    ) {
      rdy = false;
    }

    if (state.hackLastQuestion !== 0 && state.hackLastQuestion !== state.game.currentQuestion){
      rdy = true;
    }
  });

  const topTemplate = html`
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
            ${Object.values(state.game.players).sort((a, b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
          </tbody>
      </table>`

  if (!rdy){
    return html`
      ${topTemplate}
      <img width="100" height="100" src="https://m.popkey.co/fe4ba7/DYALX.gif" />`
  } else {
    state.hackLastQuestion = state.game.currentQuestion;
    return html`
      ${topTemplate}
      <div class="button" on-click=${(e) => {
        ++state.rounds;
        if (state.rounds >= state.maxRounds){
          state.page = 'win';
        } else {
          state.page = 'question';

          if (state.isCreator) {
            createNewQuestion(state.game.ref)
          }
        }

        rerender()
      }}>Next round</div>
    `
  }
}

const lederboardItemTemplate = (user) => {
  const guess = state.game.questions[state.game.currentQuestion].guesses[user.uid];
  return html`
  <tr>
      <td>${user.displayName}</td>
      <td>${guess?guess.guess:''}</td>
      <td>${user.points}</td>
  </tr>`
}

const waitingTemplate = state => html`
<video muted autoplay loop crossorigin="anonymous" src="https://media.giphy.com/media/LiWsL77P4tA9a/giphy.mp4"></video>
<h1>Waiting for players...</h1>
`

const loadingTemplate = state => html`
<section>
<img width="200" height="200" src="https://m.popkey.co/fe4ba7/DYALX.gif" />
</section>
`

const imprintTemplate = state => html`
<div class="container">
<h1>Imprint</h1><br />
<b>Contact: MyLittlePwnage@lergin.de</b>
<h1>Credits</h1><br />
<b><a href="https://haveibeenpwned.com">HaveIBeenPwned</a></b>: Provides an useful API to check passwords.<br /><br />
<b><a href="https://github.com/danielmiessler/SecLists/blob/master/Passwords/darkweb2017-top10K.txt">Daniel Miessler</a></b>: Provided password lists.
<b><a href="https://giphy.com">Giphy</a></b>: Providing funny gifs.
<h1>Authors</h1><br />
Created by Malte Laukötter, Jannik Friemann and Tom Dymel.
</div>
`

const answerTemplate = state => {
  if (!state.game.questions[state.game.currentQuestion].guesses) state.game.questions[state.game.currentQuestion].guesses = {};
  if (!state.game.questions[state.game.currentQuestion].guesses[state.user.uid]) state.game.questions[state.game.currentQuestion].guesses[state.user.uid] = {};

  const guess = state.game.questions[state.game.currentQuestion].guesses[state.user.uid].guess;
  const amount = state.game.questions[state.game.currentQuestion].guesses[state.user.uid].amount;
  const questionAmount = state.game.questions[state.game.currentQuestion].question;
  const answerPlain = state.game.questions[state.game.currentQuestion].answer;

  if (!amount) {
    return loadingTemplate(state);
  }

  const yourAnswerTemplate = state.mode === 1 ? html`Your answer is ${guess}` : html`${guess} was leaked ${amount} times`
  return html`
  <section>
  ${state.mode === 0 ? html`<h1>The answer is: ${answerPlain}</h1>`:''}
  <h1>${answerPlain} was leaked ${questionAmount} times</h1>
  <h1>${yourAnswerTemplate}</h1>
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
<div class="button" on-click=${async e => {
  const name = document.getElementById("input-name").value;

  if (name !== '') {
    await state.user.updateProfile({ displayName: name })

    addPlayerToGame(state.game.ref, state.user);

    state.game.questions[state.game.currentQuestion].Done = false;
    state.page = "question";
    rerender();
  }
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
  <div class="button" id="mode-button" on-click=${e => {
    if (state.mode === 0)
    {
      state.mode = 1;
      document.getElementById("mode-button").innerHTML = "Mode: Password => Number"
    }
    else
    {
      state.mode = 0;
      document.getElementById("mode-button").innerHTML = "Mode: Number => Password"
    }
  }}
  >Mode: ${state.mode === 0 ? 'Number => Password' : 'Password => Number'}</div>
`

const questionGuessAmountTemplate = state => {
  if (state.game.questions[state.game.currentQuestion].Done === true){
    return loadingTemplate(state);
  }

  return html`
    <h1>${state.game.questions[state.game.currentQuestion].answer}</h1> 
    <input type="text" placeholder="Leaked... times" name="input" id="input-answer"/>
    <div class="button" on-click=${e => {
      const answer = document.getElementById('input-answer').value;
    
      if (!isNaN(answer)) {
        answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);
        state.page = 'answer';
        rerender();
      }

    }}>Submit</div><br />${trivia[Math.floor(Math.random() * 7)]}
`}

const questionGuessPwTemplate = state => {
  if (state.game.questions[state.game.currentQuestion].Done === undefined || state.game.questions[state.game.currentQuestion].Done === true){
    return loadingTemplate(state);
  }

  return html`
  <h1>${state.game.questions[state.game.currentQuestion].question}</h1>
  <input type="text" placeholder="Guess password!" name="input" id="input-answer" />
  <div class="button" on-click=${e => {
      const answer = document.getElementById('input-answer').value;

      answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);

      state.page = 'answer';
      rerender();
    }}>Submit</div>
  `
}

export function rerender() {
  render(gameTemplate(state), document.body)
}
