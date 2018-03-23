import { html } from 'lit-html/lib/lit-extended.js'

import { createGameTemplate } from "./createGame";
import { questionGuessPwTemplate } from "./questionGuessPw";
import { questionGuessAmountTemplate } from "./questionGuessAmount";
import { createMPGameTemplate } from "./createMpGame";
import { setNameTemplate } from "./setName";
import { enterGroupTemplate } from "./enterGroup";
import { waitingTemplate } from "./waiting";
import { leaderboardTemplate } from "./leaderboard";
import { winTemplate } from "./win";
import { imprintTemplate } from "./imprint";
import { answerTemplate } from "./answer";
import { loadingTemplate } from "./loading";
import { rerender, changePage } from '../render';

import titleImg from '../img/party_hard_by_wolferahm-d6c8oge.png';

export const pageTemplate = (state) => html`
<header>
    <div>
      <a href="javascript:void(0);" on-click=${_ => changePage('index')}>
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
    <a href="javascript:void(0);" on-click=${_ => changePage("imprint")}>Imprint</a>
</footer>`;



const renderPage = state => {
  switch (state.page) {
    case 'index': return createGameTemplate(state);
    case 'question':
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