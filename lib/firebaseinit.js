import * as firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyB7ogQukblOMFJgxTBZ4u2uPX7NBfIBtP4",
  authDomain: "hive-site-test.firebaseapp.com",
  databaseURL: "https://hive-site-test.firebaseio.com",
  projectId: "hive-site-test",
  storageBucket: "hive-site-test.appspot.com",
  messagingSenderId: "1072509145370"
};

firebase.initializeApp(config);

export default firebase;