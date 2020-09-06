<template>
  <q-page>
    <q-card>
      <div class="q-pa-md">
        <q-input v-model="ideaName" label="Idea title" />
        <q-input v-model="ideaDescription" label="Idea description" />
        <q-btn size="17px" flat color="secondary" label="Save" icon="save" @click="save" />

        <q-table
          title="Ideas"
          :data="tableData"
          :columns="columns"
          row-key="ideaName"
          selection="single"
          :selected.sync="selected"
          :filter="filter"
          grid
          hide-header
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
            <q-card style="width: 700px">
              <q-card-section>
                <div class="text-h6">Edit</div>
              </q-card-section>

              <q-card-section v-if="selected.length>0">
                <q-input type="textarea" label="Enter name" v-model="selected[0].ideaName" />
                <q-input
                  type="textarea"
                  label="Enter description"
                  v-model="selected[0].ideaDescription"
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
                <div class="text-h6">Are you sure you want to delete this?</div>
              </q-card-section>

              <q-card-section class="q-gutter-md">
                <q-btn color="primary" label="Yes" @click="deleted" v-close-popup />
                <q-btn color="grey" label="No" v-close-popup />
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import { LocalStorage } from "quasar";
import { firestoredb } from "boot/firebase";

export default {
  data() {
    return {
      filter: "",
      selected: [],
      editRowDialog: false,
      deleteRowDialog: false,
      ideaName: null,
      ideaDescription: null,
      user: false,
      columns: [
        {
          name: "ideaName",
          label: "Idea Title",
          field: "ideaName",
          align: "center",
          sortable: true
        },
        {
          name: "ideaDescription",
          label: "Idea Description",
          field: "ideaDescription",
          align: "center",
          sortable: true
        }
      ],
      tableData: [],
      newTextEdit: this.newTextEdit
    };
  },
  created() {
    this.user = LocalStorage.getItem("user");
    this.ideasDatabase();
  },
  methods: {
    async ideasDatabase() {
      console.log(this);
      try {
        const resDB = await firestoredb
          .collection("ideas")
          .where("user", "==", this.user)
          .get();
        resDB.forEach(res => {
          console.log(res.id);
          const ideaData = {
            id: res.id,
            ideaName: res.data().ideaName,
            ideaDescription: res.data().ideaDescription
          };
          this.tableData.push(ideaData);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async save() {
      try {
        const resDB = await firestoredb.collection("ideas").add({
          ideaName: this.ideaName,
          ideaDescription: this.ideaDescription,
          user: this.user
        });
        this.tableData.push({
          ideaName: this.ideaName,
          ideaDescription: this.ideaDescription,
          id: resDB.id
        }),
          (this.ideaName = "");
        this.ideaDescription = "";
      } catch (error) {
        console.log(error);
      }
    },
    edit() {
      this.$db
        .collection("ideas")
        .doc(this.selected[0].id)
        .update({
          ideaName: this.selected[0].ideaName,
          ideaDescription: this.selected[0].ideaDescription
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
        .collection("ideas")
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
        .collection("ideas")
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