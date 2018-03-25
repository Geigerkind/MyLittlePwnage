export const state = {
  page: 'index',
  mode: 0,
  input: '',
  gamesRef: () => Promise.all([
    import(/* webpackChunkName: "firebasedatabase" */ 'firebase/database'),
    import(/* webpackChunkName: "firebaseinit" */ './firebaseinit')]).then(([_, firebase]) => firebase.database().ref('games')),
}
