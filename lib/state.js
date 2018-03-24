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
  gamesRef: () => Promise.all([
    import(/* webpackChunkName: "firebasedatabase" */ 'firebase/database'),
    import(/* webpackChunkName: "firebaseinit" */ './firebaseinit')]).then(([_, firebase]) => firebase.database().ref('games')),
  isCreator: () => state.user.uid === game.creator
}
