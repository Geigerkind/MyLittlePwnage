import { html } from 'lit-html/lib/lit-extended.js'
import { createNewQuestion } from "../logic";
import { changePage } from "../render";

export const leaderboardTemplate = state => {
  let rdy = true;
  state.game.players.forEach(user => {
    if (!state.game.currentQuestion.guesses.has(user.uid)
      || state.game.currentQuestion.guesses.get(user.uid).ready === undefined
      || state.game.currentQuestion.guesses.get(user.uid).ready !== 42
    ) {
      rdy = false;
    }

    if (state.game.hackLastQuestion !== 0 && state.game.hackLastQuestion !== state.game.currentQuestion) {
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
                  <td>Total Points</td>
              </tr>
          </thead>
          <tbody>
            ${[... state.game.players].sort((a, b) => b.points - a.points).map(pl => lederboardItemTemplate(pl))}
          </tbody>
      </table>`

  if (!rdy) {
    return html`
      ${topTemplate}
      <img width="100" height="100" src="https://m.popkey.co/fe4ba7/DYALX.gif" />`
  } else if (state.game.round >= state.game.maxRounds){
    return html`
      ${topTemplate}
      <div class="button" on-click=${_ => changePage('win')}>Finish</div>
    `
  } else if (state.user.uid === state.game.creator.uid) {
    state.game.hackLastQuestion = state.game.currentQuestion;
    return html`
      ${topTemplate}
      <div class="button" on-click=${(e) => {
        createNewQuestion(state.game.ref)

        changePage('question');
      }}>Next round</div>
    `
  } else {
    state.game.hackLastQuestion = state.game.currentQuestion;
    return html`
      ${topTemplate}
      <img width="100" height="100" src="https://m.popkey.co/fe4ba7/DYALX.gif" />`
  }
}

const lederboardItemTemplate = (user) => {
  const guess = state.game.currentQuestion.guesses.get(user.uid);
  return html`
  <tr>
      <td>${user.displayName}</td>
      <td>${guess ? guess.guess : '?'}</td>
      <td>${guess && Number.isInteger(guess.amount) ? guess.getPoints() : '?'}</td>
      <td>${user.points}</td>
  </tr>`
}