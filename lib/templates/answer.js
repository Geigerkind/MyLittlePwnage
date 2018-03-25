import { html } from 'lit-html/lib/lit-extended.js'
import { loadingTemplate } from "./loading";
import { playerReady, getPoints } from "../logic";
import { changePage } from "../render";

export const answerTemplate = state => {
  const question = state.game.currentQuestion;

  if(!question.guesses.has(state.user.uid)){
    return loadingTemplate(state);
  }

  const guess = question.guesses.get(state.user.uid);

  if (guess.amount === undefined) {
    return loadingTemplate(state);
  }

  const yourAnswerTemplate = question.mode === 1 ? html`Your answer is ${guess.guess}` : html`${guess.guess} was leaked ${guess.amount} times`;

  return html`
  ${question.mode === 0 ? html`<h1>The answer is: ${question.answer}</h1>` : ''}
  <h1>${question.answer} was leaked ${question.question} times</h1>
  <h1>${yourAnswerTemplate}</h1>
  <h1>You gained ${guess.getPoints()} points</h1>
  <div class="button" on-click=${e => {
      state.game.currentQuestion.done = true;
      state.game.currentQuestion.playerIsReady(state.user);

      changePage('leaderboard')
    }}>View rankings</div>
  `
}
