import { html } from 'lit-html/lib/lit-extended.js'
import { joinGame } from "../logic";
import { changePage } from "../render";

export const enterGroupTemplate = state => html`
<input type="text" placeholder="Enter your name!" name="name" id="input-username"/><br />
<input type="text" placeholder="Enter group key!" name="groupkey" id="input-groupkey" />
<div class="button" on-click=${e => {
    const groupkey = document.getElementById('input-groupkey').value;
    state.user.updateProfile({ displayName: document.getElementById("input-username").value })

    joinGame(groupkey, state.user);

    changePage("question");
  }}>Enter group</div>
`
