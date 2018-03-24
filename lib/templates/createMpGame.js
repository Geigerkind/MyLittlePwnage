import { html } from 'lit-html/lib/lit-extended.js'
import { createNewGame } from "../logic";
import { anonLogin } from "../login";
import { changePage } from "../render";

export const createMPGameTemplate = state => html`
<div class="button" on-click=${e => {
    if (!state.user) {
      anonLogin().then(user => {
        createNewGame(user);

        changePage('name')
      })
    } else {
      createNewGame(state.user);

      changePage('name')
    }
  }}>Create group</div>
<div class="button" on-click=${_ => changePage('enter_group')}>Join group</div>
`
