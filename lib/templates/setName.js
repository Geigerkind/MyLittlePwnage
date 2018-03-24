import { html } from 'lit-html/lib/lit-extended.js'
import { addPlayerToGame } from "../logic";
import { changePage } from "../render";

export const setNameTemplate = state => html`
<h1>Your group key is: </h1>
<h1><a href="/#!${state.game.ref.key}" on-click=${e => {
  if (navigator.share) {
    navigator.share({
      title: 'My Little Pwnage',
      text: 'Lets guess some passwords!',
      url: '/#!' + state.game.ref.key,
    })
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
  }
}}>${state.game.ref.key}</a></h1>
<input type="text" placeholder="Enter your name!" name="name" id="input-name" />
<div class="button" on-click=${async e => {
    const name = document.getElementById("input-name").value;

    if (name !== '') {
      state.user.displayName = name;
      state.user.points = 0;
      state.game.addPlayer(state.user);

      changePage('question');
    }
  }}>Enter group</div>
`
