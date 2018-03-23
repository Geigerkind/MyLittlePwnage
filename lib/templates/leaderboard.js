import { html } from 'lit-html/lib/lit-extended.js'
import { createNewQuestion } from "../logic";
import { changePage } from "../render";

export const leaderboardTemplate = state => {
  let rdy = true;
  state.game.players.forEach(element => {
    if (state.game.questions[state.game.currentQuestion].guesses[element.uid] === undefined
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready === undefined
      || state.game.questions[state.game.currentQuestion].guesses[element.uid].ready !== 42
    ) {
      rdy = false;
    }

    if (state.hackLastQuestion !== 0 && state.hackLastQuestion !== state.game.currentQuestion) {
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

  if (!rdy) {
    return html`
      ${topTemplate}
      <img width="100" height="100" src="https://m.popkey.co/fe4ba7/DYALX.gif" />`
  } else {
    state.hackLastQuestion = state.game.currentQuestion;
    return html`
      ${topTemplate}
      <div class="button" on-click=${(e) => {
        ++state.rounds;
        if (state.rounds >= state.maxRounds) {
          changePage('win');
        } else {
          if (state.isCreator) {
            createNewQuestion(state.game.ref)
          }

          changePage('question');
        }
      }}>Next round</div>
    `
  }
}

const lederboardItemTemplate = (user) => {
  const guess = state.game.questions[state.game.currentQuestion].guesses[user.uid];
  return html`
  <tr>
      <td>${user.displayName}</td>
      <td>${guess ? guess.guess : ''}</td>
      <td>${user.points}</td>
  </tr>`
}