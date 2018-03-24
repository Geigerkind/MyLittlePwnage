import './firebaseinit'
import * as firebase from 'firebase/app'

export const state = {
  game: {
    players: []
  },
  page: 'index',
  players: [],
  rounds: 0,
  mode: 0,
  maxRounds: 10,
  hackLastQuestion: 0,
  gamesRef: () => import(/* webpackChunkName: "firebasedatabase" */ 'firebase/database').then(_ => firebase.database().ref('games')),
  isCreator: () => state.user.uid === game.creator
}
