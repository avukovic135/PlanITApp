<template>
  <q-page padding>
    <div class="flex flex-center">
      <q-card style="width:750px">
        <div class="q-pa-md">
          <q-toolbar-title align="center" class="bg-secondary text-white">Add a goal for yourself!</q-toolbar-title>
          <q-input outlined v-model="goalName" label="Goal name" />
          <q-input outlined v-model="description" type="textarea" label="Description" />
          <q-btn size="17px" flat color="secondary" label="Save" icon="emoji_events" @click="save" />

          <q-table
            class="bg-orange-1 text-black"
            title="Goals"
            :data="tableData"
            :columns="columns"
            row-key="goalName"
            selection="single"
            :selected.sync="selected"
          />

          <q-btn
            :disable="selected.length === 0"
            flat
            color="secondary"
            icon="edit"
            @click="editRowDialog = true"
          />
          <q-btn
            :disable="selected.length === 0"
            class="q-pr-s"
            flat
            color="accent"
            icon="delete"
            @click="deleteRowDialog = true"
          />

          <div class="q-pa-md q-gutter-sm">
            <q-dialog v-model="editRowDialog" persistent>
              <q-card style="width: 500px">
                <q-card-section>
                  <div class="text-h6 text-center">Edit</div>
                </q-card-section>

                <q-card-section v-if="selected.length>0">
                  <q-input label="Enter name" v-model="selected[0].goalName" />
                  <q-input
                    type="textarea"
                    label="Enter description"
                    v-model="selected[0].description"
                  />
                  <q-btn flat color="primary" label="Save" @click="edit" v-close-popup />
                  <q-btn flat color="primary" label="Cancel" v-close-popup clickable />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>

          <div class="q-pa-md q-gutter-sm">
            <q-dialog v-model="deleteRowDialog">
              <q-card style="width: 300px">
                <q-card-section>
                  <div class="text-h6 text-center">Are you sure you want to delete this?</div>
                </q-card-section>

                <q-card-section class="q-gutter-md text-center">
                  <q-btn color="primary" label="Yes" @click="deleted" v-close-popup />
                  <q-btn color="grey" label="No" v-close-popup />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { firestoredb } from "../boot/firebase";
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      filter: "",
      selected: [],
      editRowDialog: false,
      deleteRowDialog: false,
      goalName: null,
      description: null,
      user: false,
      columns: [
        {
          name: "goalName",
          label: "Goal Name",
          field: "goalName",
          align: "center",
          sortable: true
        },
        {
          name: "description",
          label: "Description",
          field: "description",
          align: "center",
          sortable: true
        }
      ],
      tableData: [],
      newTextEdit: this.newTextEdit
    };
  },
  mounted() {
    this.user = LocalStorage.getItem("user");
    this.getGoals();
  },
  methods: {
    async getGoals() {
      let snapshot = await firestoredb
        .collection("goals")
        .where("user", "==", this.user)
        .get();
      let tableData = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        tableData.push(appData);
      });
      this.tableData = tableData;
    },
    async save() {
      await firestoredb.collection("goals").add({
        goalName: this.goalName,
        description: this.description,
        user: this.user
      });
      this.getGoals();
      this.goalName = "";
      this.description = "";
    },
    edit() {
      this.$db
        .collection("goals")
        .doc(this.selected[0].id)
        .update({
          goalName: this.selected[0].goalName,
          description: this.selected[0].description
        })
        .then(function() {
          console.log("Document successfully updated!");
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    deleted() {
      this.$db
        .collection("goals")
        .doc(this.selected[0].id)
        .delete()
        .then(function() {
          console.log("Document successfully deleted!");
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    retireveCollection() {
      var objectArray = [];
      this.$db
        .collection("goals")
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