import { html } from 'lit-html/lib/lit-extended.js'
import { loadingTemplate } from "./loading";
import { answerQuestion } from "../logic";
import { changePage } from "../render";
import { getRandomTrivia } from "../trivia";

export const questionGuessAmountTemplate = state => {
  if (state.game.questions[state.game.currentQuestion].Done === true) {
    return loadingTemplate(state);
  }

  return html`
    <h1>${state.game.questions[state.game.currentQuestion].answer}</h1> 
    <input type="text" placeholder="Leaked... times" name="input" id="input-answer"/>
    <div class="button" on-click=${e => {
      const answer = document.getElementById('input-answer').value;

      if (!isNaN(answer)) {
        answerQuestion(state.game.questions[state.game.currentQuestion].ref, state.user, answer);
        
        changePage('answer');
      }

    }}>Submit</div>
    <br />
    ${getRandomTrivia()}
`}
