import { LocalStorage, Loading } from "quasar";
import { firebaseAuth, firestoredb } from "boot/firebase";
import { showErrorMessage } from "src/functions/functionShowErrorMessage";

const state = {
  loggedIn: false,
  user: false
};

const mutations = {
  setLoggedIn(state, value) {
    state.loggedIn = value;
  }
};

const actions = {
  registerUser({}, payload) {
    Loading.show();
    firebaseAuth
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log("response: ", response);
        this.state.user = response.user.uid;
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
  },
  loginUser({}, payload) {
    Loading.show();
    firebaseAuth
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then(response => {
        console.log("response: ", response);
        this.state.user = response.user.uid;
      })
      .catch(error => {
        showErrorMessage(error.message);
      });
  },
  logoutUser() {
    console.log("logoutUser");
    firebaseAuth.signOut();
  },
  handleAuthStateChange({ commit }) {
    firebaseAuth.onAuthStateChanged(user => {
      Loading.hide();
      if (user) {
        commit("setLoggedIn", user.uid);
        LocalStorage.set("loggedIn", true);
        LocalStorage.set("user", user.uid);
        this.$router.push("/today");
      } else {
        commit("setLoggedIn", false);
        LocalStorage.set("loggedIn", false);
        LocalStorage.set("user", false);
        this.$router.replace("/auth");
      }
    });
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
