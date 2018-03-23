import { html } from 'lit-html/lib/lit-extended.js'
import { changePage } from "../render";

const winningGifs = [
  "https://media.giphy.com/media/2gtoSIzdrSMFO/giphy.mp4",
  "https://media.giphy.com/media/g9582DNuQppxC/giphy.mp4",
  "https://media.giphy.com/media/xT0xezQGU5xCDJuCPe/giphy.mp4",
  "https://media.giphy.com/media/3o6fIUZTTDl0IDjbZS/giphy.mp4",
  "https://media.giphy.com/media/xHMIDAy1qkzNS/giphy.mp4",
  "https://media.giphy.com/media/DKnMqdm9i980E/giphy.mp4",
  "https://media.giphy.com/media/3o7TKJhBfNCiispgDm/giphy.mp4",
  "https://media.giphy.com/media/cQNRp4QA8z7B6/giphy.mp4",
  "https://media.giphy.com/media/K3RxMSrERT8iI/giphy.mp4",
  "https://media.giphy.com/media/RWFpHUbc6s492/giphy.mp4",
  "https://media.giphy.com/media/3NtY188QaxDdC/giphy.mp4",
  "https://media.giphy.com/media/rjkJD1v80CjYs/giphy.mp4",
  "https://media.giphy.com/media/DYH297XiCS2Ck/giphy.mp4",
  "https://media.giphy.com/media/l4hLwMmFVBOAKF3EI/giphy.mp4",
  "https://media3.giphy.com/media/SRO0ZwmImic0/giphy.mp4"
];

export const winTemplate = (state) => html`
<h1>${state.game.players.length > 0 ? Object.values(state.game.players).sort((a, b) => b.points - a.points)[0].displayName : '?'} wins!</h1>
<video muted autoplay loop crossorigin="anonymous" src="${winningGifs[Math.floor(Math.random() * winningGifs.length)]}"></video>

<div class="button" on-click=${_ => changePage('index')}>New game</div>`
