<template>
  <div>
    <q-splitter v-model="splitterModel" style="height: 1000px">
      <template v-slot:before>
        <div class="text-center q-pa-md">
          <q-date v-model="date" :now="today" :events="events" event-color="accent" minimal />
        </div>
        <div class="text-center q-mb-lg">
          <q-btn round color="secondary" size="20px" icon="add" @click="showAddEvent = true" />
          <q-dialog v-model="showAddEvent">
            <q-card>
              <q-card-section>
                <div class="text-h6">Add Event</div>
              </q-card-section>
              <q-form>
                <q-card-section class="q-pt-none">
                  <div class="row q-mb-sm">
                    <q-input
                      outlined
                      autofocus
                      label="Event name"
                      v-model="name"
                      class="col"
                      :rules="[val => !!val || 'Event name is required']"
                      ref="name"
                    />
                  </div>
                  <div class="row q-mb-sm">
                    <q-input label="Set start date" outlined>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="startDate" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="row q-mb-sm">
                    <q-input label="Set end date" outlined>
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="endDate" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-form>
              <q-card-actions align="right">
                <q-btn label="Add" color="secondary" @click="addEvent" v-close-popup />
                <q-btn label="Cancel" color="accent" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </template>

      <template v-slot:after>
        <div class="flex flex-center">
          <div class="q-pa-md" style="width: 450px">
            <q-toolbar class="bg-secondary text-white shadow-2">
              <q-toolbar-title class="text-center">My Events</q-toolbar-title>
            </q-toolbar>

            <q-list bordered dense class="bg-orange-1">
              <q-item v-for="(event,index) in events" :key="index" class="q-my-sm" v-ripple>
                <q-item-section avatar>
                  <q-btn flat icon="delete" color="accent" @click="deleteEvent(index, event.id)" />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ event.name }}</q-item-label>
                  <q-item-label caption lines="1">{{ event.startDate }}</q-item-label>
                  <q-item-label caption lines="1">{{ event.endDate }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { firestoredb } from "../boot/firebase";
import { LocalStorage } from "quasar";
export default {
  data() {
    return {
      today: new Date().toISOString().substr(0, 10),
      showAddEvent: false,
      splitterModel: 50,
      date: "",
      name: null,
      startDate: null,
      endDate: null,
      user: false,
      events: []
    };
  },
  mounted() {
    this.user = LocalStorage.getItem("user");
    this.getEvents();
  },
  methods: {
    async getEvents() {
      let snapshot = await firestoredb
        .collection("monthEvents")
        .where("user", "==", this.user)
        .get();
      let events = [];
      snapshot.forEach(doc => {
        let appData = doc.data();
        appData.id = doc.id;
        events.push(appData);
      });
      this.events = events;
    },
    async addEvent() {
      await firestoredb.collection("monthEvents").add({
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        user: this.user
      });
      this.getEvents();
      this.name = "";
      this.startDate = "";
      this.endDate = "";
    },
    deleteEvent(index, id) {
      this.$q
        .dialog({
          title: "Confirm",
          message: "Are you sure you want to delete this event?",
          cancel: true,
          persistent: true
        })
        .onOk(async () => {
          try {
            await firestoredb
              .collection("monthEvents")
              .doc(id)
              .delete();
            this.events.splice(index, 1);
          } catch (error) {
            console.log(error);
          }
        });
    }
  }
};
</script>