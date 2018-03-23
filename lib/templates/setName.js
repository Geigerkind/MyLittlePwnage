import { html } from 'lit-html/lib/lit-extended.js'
import { addPlayerToGame } from "../logic";
import { changePage } from "../render";

export const setNameTemplate = state => html`
<h1>Your group key is: </h1>
<h1>${state.game.id}</h1>
<input type="text" placeholder="Enter your name!" name="name" id="input-name" />
<div class="button" on-click=${async e => {
    const name = document.getElementById("input-name").value;

    if (name !== '') {
      await state.user.updateProfile({ displayName: name })

      addPlayerToGame(state.game.ref, state.user);

      changePage('question');
    }
  }}>Enter group</div>
`