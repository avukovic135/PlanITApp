<template>
  <div class="text-center q-pa-md">
    <q-btn label="Add a task" color="secondary" size="20px" icon="add" @click="showAddTask = true" />
    <q-dialog v-model="showAddTask">
      <q-card style="width: 400px">
        <q-card-section>
          <div class="text-h6">Add Task</div>
        </q-card-section>
        <q-form>
          <q-card-section class="q-pt-none">
            <div class="col q-mb-sm">
              <q-input
                outlined
                autofocus
                label="Task name"
                v-model="taskName"
                class="col"
                :rules="[val => !!val || 'Task name is required']"
                ref="taskName"
              />
              <q-input
                outlined
                label="Add a description"
                v-model="taskDescription"
                type="textarea"
              />
            </div>
            <div class="col q-mb-sm">
              <q-input outlined label="Add date" v-model="date" mask="date" :rules="['date']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                      <q-date v-model="date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col q-mb-sm">
              <q-input outlined label="Add time" v-model="time" mask="time" :rules="['time']">
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="time">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-card-section>
        </q-form>
        <q-card-actions align="right">
          <q-btn label="Add" color="secondary" @click="addTask" v-close-popup />
          <q-btn label="Cancel" color="grey" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <div class="flex flex-center">
      <div class="q-pa-md" style="width: 600px">
        <q-toolbar class="bg-secondary text-white shadow-2">
          <q-toolbar-title class="text-center">To Do List</q-toolbar-title>
        </q-toolbar>

        <q-list bordered align="left" class="bg-orange-1">
          <q-item v-for="(task,index) in tasks" :key="index" class="q-my-sm" v-ripple>
            <q-item-section avatar>
              <q-btn flat icon="check" color="accent" @click="deleteTask(index, task.id)" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ task.taskName }}</q-item-label>
              <q-item-label caption lines="1">{{ task.date }}</q-item-label>
              <q-item-label caption lines="1">{{ task.time }}</q-item-label>
              <q-item-label caption>{{ task.taskDescription }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </div>
</template>


<script>
import { firestoredb } from "../boot/firebase";
import { LocalStorage } from "quasar";

export default {
  data() {
    return {
      showAddTask: false,
      taskName: null,
      taskDescription: null,
      date: null,
      time: null,
      user: false,
      tasks: []
    };
  },
  mounted() {
    this.user = LocalStorage.getItem("user");
    this.getTasks();
  },
  methods: {
    async getTasks() {
      let snapshot = await firestoredb
        .collection("todolist")
        .where("user", "==", this.user)
        .get();
      let tasks = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        tasks.push(appData);
      });
      this.tasks = tasks;
    },
    async addTask() {
      await firestoredb.collection("todolist").add({
        taskName: this.taskName,
        taskDescription: this.taskDescription,
        date: this.date,
        time: this.time,
        user: this.user
      });
      this.getTasks();
      this.taskName = "";
      this.taskDescription = "";
      this.date = "";
      this.time = "";
    },
    deleteTask(index, id) {
      this.$q
        .dialog({
          title: "Congrats!!",
          message: "You just completed this task, keep it up!",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await firestoredb
              .collection("todolist")
              .doc(id)
              .delete();
            this.tasks.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        });
    }
  }
};
</script>

<style >
.q-scroll-area {
  display: flex;
  flex-grow: 1;
}
</style>