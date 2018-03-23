import { html } from 'lit-html/lib/lit-extended.js'
import { loadingTemplate } from "./loading";
import { playerReady, getPoints } from "../logic";
import { changePage } from "../render";

export const answerTemplate = state => {
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
  ${state.mode === 0 ? html`<h1>The answer is: ${answerPlain}</h1>` : ''}
  <h1>${answerPlain} was leaked ${questionAmount} times</h1>
  <h1>${yourAnswerTemplate}</h1>
  <h1>You gained ${getPoints(amount, questionAmount)} points</h1>
  <div class="button" on-click=${e => {
      state.game.questions[state.game.currentQuestion].Done = true;
      playerReady(state.game.questions[state.game.currentQuestion].ref, state.user);

      changePage('leaderboard')
    }}>View rankings</div>
  </section>
  `
}
