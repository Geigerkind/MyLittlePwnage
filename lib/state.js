export const state = {
  game: {
    players: []
  },
  page: 'index',
  mode: 0,
  gamesRef: () => Promise.all([
    import(/* webpackChunkName: "firebasedatabase" */ 'firebase/database'),
    import(/* webpackChunkName: "firebaseinit" */ './firebaseinit')]).then(([_, firebase]) => firebase.database().ref('games')),
}
