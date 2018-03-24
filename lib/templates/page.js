import { html } from 'lit-html/lib/lit-extended.js'

import { createGameTemplate } from "./createGame";
import { rerender, changePage } from '../render';

import titleImg from '../img/party_hard_by_wolferahm-d6c8oge.png';

export const pageTemplate = (state) => html`
<header>
    <div>
      <a href="javascript:void(0);" on-click=${_ => changePage('index')}>
        <img height="40" width="40" src="${titleImg}" title="MyLittlePwnage" alt="A unicorn vomiting a rainbow"  />
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
    <a href="https://lergin.de/imprint">Imprint</a>
    <a href="https://lergin.de/privacy">Privacy<a>
    <a href="javascript:void(0);" on-click=${_ => changePage("imprint")}>Credits</a>
</footer>`;



const renderPage = state => {
  if(state.page == "index"){
    return createGameTemplate(state)
  }
  
  switch (state.page){
    case 'index': return createGameTemplate(state);
    case 'imprint': return import(/* webpackChunkName: "imprint" */ './imprint').then(({ imprintTemplate }) => imprintTemplate(state));
  }

  return import(/* webpackChunkName: "gamelogic" */ '../gameLogic').then(({ 
    questionGuessPwTemplate, questionGuessAmountTemplate, createMPGameTemplate, setNameTemplate, enterGroupTemplate, leaderboardTemplate, answerTemplate,
    loadingTemplate, winTemplate, waitingTemplate
  }) => {
    switch (state.page) {
      case 'question':
        switch (state.game.mode) {
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
      case 'answer': return answerTemplate(state);
      case 'loading': return loadingTemplate(state);
    }
  });
}