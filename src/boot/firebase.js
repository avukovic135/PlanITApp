import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDADYKjnTvvev8L9r5f5-t3kN04a1C6I4E",
  authDomain: "planit-3efbf.firebaseapp.com",
  databaseURL: "https://planit-3efbf.firebaseio.com",
  projectId: "planit-3efbf",
  storageBucket: "planit-3efbf.appspot.com",
  messagingSenderId: "181683754142",
  appId: "1:181683754142:web:f220680b63f1fc6c26978f"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firestoredb = firebase.firestore();

export { firebaseAuth, firestoredb, firebase };

export default ({ Vue }) => {
  Vue.prototype.$db = firestoredb;
};
