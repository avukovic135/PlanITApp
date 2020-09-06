<template>
  <div class="q-pa-md q-gutter-sm">
    <q-editor
      v-model="editor"
      :definitions="{
        save: {
          tip: 'Save your stories',
          icon: 'save',
          label: 'Save',
          handler: saveWork
        }
      }"
      :toolbar="[['bold', 'italic', 'strike', 'underline'], ['save']]"
    />

    <q-card class="row" flat bordered v-for="(item, index) in diaryContent" :key="index">
      <q-card-section class="col" v-html="item.diaryText" />
      <q-btn icon="delete" color="accent" flat @click="deleteInput(index, item.id)"></q-btn>
    </q-card>

    <div class="flex flex-center" v-if="diaryContent.length == 0">
      <h6>My Diary</h6>
    </div>
  </div>
</template>

<script>
import { firestoredb } from "boot/firebase";
import { LocalStorage } from "quasar";

export default {
  data() {
    return {
      editor: "",
      diaryContent: [],
      user: false
    };
  },
  created() {
    this.user = LocalStorage.getItem("user");
    this.diaryDatabase();
  },
  methods: {
    async diaryDatabase() {
      console.log(this);
      try {
        const resDB = await firestoredb
          .collection("diary")
          .where("user", "==", this.user)
          .get();
        resDB.forEach(res => {
          console.log(res.id);
          const diaryData = { id: res.id, diaryText: res.data().diaryText };

          this.diaryContent.push(diaryData);
        });
      } catch (error) {
        console.log(error);
      }
    },
    async saveWork() {
      console.log(this);
      try {
        const resDB = await firestoredb.collection("diary").add({
          diaryText: this.editor,
          user: this.user
        });
        this.diaryContent.push({
          diaryText: this.editor,
          id: resDB.id
        }),
          (this.editor = "");
        this.$q.notify({
          message: "Your secret's safe with me!",
          color: "secondary",
          textColor: "white",
          icon: "cloud_done"
        });
      } catch (error) {
        console.log(error);
      }
    },
    deleteInput(index, id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await firestoredb
              .collection("diary")
              .doc(id)
              .delete();
            this.diaryContent.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        });
    }
  }
};
</script>

<style></style>
