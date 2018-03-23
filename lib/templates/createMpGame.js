import { html } from 'lit-html/lib/lit-extended.js'
import { createNewGame } from "../logic";
import { anonLogin } from "../login";
import { changePage } from "../render";
import { createGameListener } from "../state";

export const createMPGameTemplate = state => html`
<div class="button" on-click=${e => {
    if (!state.user) {
      anonLogin().then(_ => {
        let gameref = createNewGame(state.user)

        createGameListener(gameref)

        changePage('name')
      })
    } else {
      let gameref = createNewGame(state.user)

      createGameListener(gameref)

      changePage('name')
    }
  }}>Create group</div>
<div class="button" on-click=${_ => changePage('enter_group')}>Join group</div>
`
