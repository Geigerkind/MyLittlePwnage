import './firebaseinit'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { rerender } from './render';
import { state } from './state';
import { User } from './User';

const auth = firebase.auth();

/**
 * shows the login panel
 */
export function login() {
  import(/* webpackChunkName: "firebaseui" */ 'firebaseui').then(firebaseui => {
    const ui = new firebaseui.auth.AuthUI(auth);

    const uiConfig = {
      signInFlow: 'popup',
      signInSuccessUrl: 'localhost:5000',
      signInOptions: [
        auth.GoogleAuthProvider.PROVIDER_ID
      ]
    };

    ui.start('#firebaseui-auth-container', uiConfig);
  })
  
}

/**
 * anonymous login
 */
export function anonLogin() {
  return auth.signInAnonymously();
}

export function logout() {
  auth.signOut();
}

auth.onAuthStateChanged(user => {
  if (user) {
    state.user = new User(user.uid);

    state.user.displayName = user.displayName;
    state.user.originalUser = user;

  } else {
    console.log('logout')
  }

  rerender()
});