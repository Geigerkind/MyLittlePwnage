import { html } from 'lit-html/lib/lit-extended.js'
import { loadingTemplate } from "./loading";
import { answerQuestion } from "../logic";
import { changePage } from "../render";
import { getRandomTrivia } from "../trivia";

export const questionGuessPwTemplate = state => {
  if (state.game.questions[state.game.currentQuestion].Done === true) {
    return loadingTemplate(state);
  }

  return html`
  <h1>${state.game.questions[state.game.currentQuestion].question}</h1>
  <input type="text" placeholder="Guess password!" name="input" id="input-answer" />
  <div class="button" on-click=${e => {
      const answer = document.getElementById('input-answer').value;

      answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);

      changePage('answer')
    }}>Submit</div>
    <br />
    ${getRandomTrivia()}
  `
}