import { html } from 'lit-html/lib/lit-extended.js'
import { rerender, changePage } from "../render";
import titleImg from '../img/party_hard_by_wolferahm-d6c8oge.png';

export const createGameTemplate = state => html`
<img height="200" width="200" src="${titleImg}"  alt="A unicorn vomiting a rainbow" />
<h1>Ready to pwn?</h1>
<div class="button" on-click=${e => {
  import(/* webpackChunkName: "gamelogic" */ '../gameLogic').then(({ anonLogin, createNewGame}) => {
    if (!state.user) {
      anonLogin().then(user => {
        createNewGame(user);

        changePage('name');
      });
    } else {
      createNewGame(state.user);
        
      changePage('name');
    }
  })
  }}>Singleplayer</div>
<div class="button" on-click=${_ => changePage('create_mp')}>Multiplayer</div>
  <div class="button" id="mode-button" on-click=${e => {
    if (state.mode === 0) {
      state.mode = 1;
    } else {
      state.mode = 0;
    }

    rerender();
  }}
  >Mode: ${state.mode === 0 ? 'Number => Password' : 'Password => Number'}</div>
`
