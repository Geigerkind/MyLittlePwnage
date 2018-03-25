import { html } from 'lit-html/lib/lit-extended.js'
import { loadingTemplate } from "./loading";
import { answerQuestion } from "../logic";
import { changePage } from "../render";
import { getTrivia } from "../trivia";

let input = "";

export const questionGuessAmountTemplate = state => {
  if (state.game.currentQuestion.done === true || !state.game.currentQuestion.question) {
    return loadingTemplate(state);
  }

  return html`
  <h1>${state.game.currentQuestion.answer}</h1> 
  <input type="number" placeholder="Leaked... times" name="input" id="input-answer" value=${input} on-change=${_ => input = document.getElementById('input-answer').value}/>
  <div class="button" on-click=${e => {
    const answer = document.getElementById('input-answer').value;

    if (Number.isInteger(parseInt(answer))) {
      state.game.currentQuestion.answerQuestion(state.user, answer);
      
      changePage('answer');
    }
  }}>Submit</div>
  <div class="trivia">${getTrivia()}</div>
`}
