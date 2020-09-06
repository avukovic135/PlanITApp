<template>
  <div class="col q-pa-md" align="center">
    <q-card style="max-width: 450px">
      <q-toolbar-title class="text-center bg-secondary text-white text-h5">My Finance Tracker</q-toolbar-title>
      <div class="col q-pa-md">
        <q-card-section align="center">
          <q-btn color="secondary" label="Your balance" />
        </q-card-section>
        <q-card-section></q-card-section>
      </div>
    </q-card>

    <div class="q-pa-md" style="max-width: 450px">
      <q-toolbar class="bg-secondary text-white shadow-2">
        <q-toolbar-title class="text-center">Transaction History</q-toolbar-title>
      </q-toolbar>

      <q-list bordered dense>
        <q-item v-for="transaction in transactions" :key="transaction.id" class="q-my-sm" v-ripple>
          <q-item-section avatar>
            <q-btn flat icon="delete" color="accent" @click="deleteTransaction(transaction.id)" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ transaction.amount }}</q-item-label>
            <q-item-label caption lines="1">{{ transaction.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col">
      <q-card style="max-width: 450px">
        <q-toolbar-title
          class="text-center text-h7 bg-secondary text-white shadow-2"
        >Add new transaction</q-toolbar-title>
        <div class="col text-center">
          <q-card-section
            class="text-h6 text-secondary"
          >Enter Amount (negative-expense, positive-income)</q-card-section>
          <q-card-section>
            <q-input type="number" v-model="amount" label="amount" />
          </q-card-section>
        </div>
        <div class="col text-center">
          <q-card-section class="text-h6 text-secondary">Enter description</q-card-section>
          <q-card-section>
            <q-input
              :rules="[val => !!val || 'Description is required']"
              type="text"
              v-model="description"
              label="description"
            />
          </q-card-section>
          <q-card-actions align="center">
            <q-btn label="add transaction" color="secondary" @click="addTransaction" />
          </q-card-actions>
        </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import { firestoredb } from "boot/firebase";
import { LocalStorage } from "quasar";

export default {
  data() {
    return {
      amount: null,
      description: null,
      user: false,
      transactions: []
    };
  },
  created() {
    this.user = LocalStorage.getItem("user");
    this.getFinances();
  },
  methods: {
    async getFinances() {
      try {
        const resDB = await firestoredb
          .collection("finances")
          .where("user", "==", this.user)
          .get();
        resDB.forEach(res => {
          const financeData = {
            id: res.id,
            amount: res.data().amount,
            description: res.data().description,
            user: res.data().user
          };
          this.transactions.push(financeData);
        });
      } catch (error) {
        console.log(error);
      }
    },
    transactionRule() {
      this.$refs.description.validate();
      if (!this.$refs.description.hasError) {
        this.addTransaction();
      }
    },
    async addTransaction() {
      try {
        const resDB = await firestoredb.collection("finances").add({
          amount: this.amount,
          description: this.description,
          user: this.user
        });
        this.transactions.push({
          amount: this.amount,
          description: this.description,
          id: resDB.id
        }),
          (this.amount = ""),
          (this.description = "");
        this.$q.notify({
          message: "You added a new transaction!",
          color: "accent",
          textColor: "black",
          icon: "cloud_done"
        });
      } catch (error) {
        console.log(error);
      }
    },
    deleteTransaction(id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this transaction?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await firestoredb
              .collection("finances")
              .doc(id)
              .delete();
            this.transactions.splice(id);
          } catch (error) {
            console.log(error);
          }
        });
    },
    retireveCollection() {
      var objectArray = [];
      this.$db
        .collection("finances")
        .where("user", "==", this.user)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            objectArray.push(doc.data());
          });
        });
      return objectArray;
    }
  }
};
</script>