<template>
  <div class="q-pa-md">
    <div class="flex flex-center">
      <q-card>
        <q-card-section class="bg-primary">
          <q-toolbar-title class="text-h6 text-center text-white">Add a new note</q-toolbar-title>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn icon="add" round color="primary" size="17px" @click="noteDialog=true" />
        </q-card-actions>
      </q-card>
    </div>

    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="noteDialog" persistent>
        <q-card style="width: 700px">
          <q-card-section align="center">
            <div class="text-h6">Add note</div>
          </q-card-section>

          <q-card-section>
            <q-input outlined v-model="title" label="Enter title" />
          </q-card-section>
          <q-card-section>
            <q-input outlined label="Enter date" v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <q-toolbar-title class="text-h6 text-center">Add content to your note</q-toolbar-title>
            <q-input outlined v-model="noteText" type="textarea" label="Write something here..." />
          </q-card-section>
          <q-card-actions>
            <q-btn flat size="17px" color="primary" label="Save" @click="saveNote" v-close-popup />
            <q-btn flat size="17px" color="primary" label="Cancel" v-close-popup clickable />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <q-table
      grid
      title="Notes"
      :data="notesData"
      :columns="columns"
      row-key="title"
      selection="single"
      :selected.sync="selected"
      :filter="filter"
      hide-header
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>

    <q-btn
      :disable="selected.length === 0"
      icon="delete"
      color="accent"
      label="delete note"
      @click="deleteDialog = true"
    />
    <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="deleteDialog">
        <q-card style="width: 300px">
          <q-card-section>
            <div class="text-h6 text-center">Are you sure you want to delete this note?</div>
          </q-card-section>

          <q-card-section align="center" class="q-gutter-md">
            <q-btn color="primary" label="Yes" @click="deleteNote" v-close-popup />
            <q-btn color="grey" label="No" v-close-popup />
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script>
import { LocalStorage } from "quasar";
import { firestoredb } from "boot/firebase";
export default {
  data() {
    return {
      title: null,
      noteText: null,
      date: "",
      filter: "",
      selected: [],
      noteDialog: false,
      deleteDialog: false,
      user: false,
      columns: [
        {
          name: "title",
          required: true,
          label: "Title",
          align: "left",
          field: row => row.title,
          format: val => `${val}`,
          sortable: true
        },
        {
          name: "date",
          align: "center",
          label: "Date",
          field: "date",
          sortable: true
        },
        { name: "noteText", label: "Note", field: "noteText" }
      ],
      notesData: []
    };
  },
  mounted() {
    this.user = LocalStorage.getItem("user");
    this.getNotes();
  },
  methods: {
    async getNotes() {
      let snapshot = await firestoredb
        .collection("notes")
        .where("user", "==", this.user)
        .get();
      let notesData = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        notesData.push(appData);
      });
      this.notesData = notesData;
    },
    async saveNote() {
      await firestoredb.collection("notes").add({
        title: this.title,
        noteText: this.noteText,
        date: this.date,
        user: this.user
      });
      this.getNotes();
      this.title = "";
      this.noteText = "";
      this.date = "";
    },
    deleteNote() {
      this.$db
        .collection("notes")
        .doc(this.selected[0].id)
        .delete()
        .then(function() {})
        .catch(error => {
          console.error("Error adding document: ", error);
        });
    },
    retireveCollection() {
      var objectArray = [];
      this.$db
        .collection("notes")
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

