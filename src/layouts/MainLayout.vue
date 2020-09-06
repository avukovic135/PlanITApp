<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="absolute-center">planIT</q-toolbar-title>

        <q-btn
          v-if="!loggedIn"
          to="/auth"
          flat
          icon-right="account_circle"
          label="Login"
          class="absolute-right"
        />

        <q-btn
          v-else
          @click="logoutUser"
          flat
          icon-right="account_circle"
          label="Logout"
          class="absolute-right"
        />
      </q-toolbar>
    </q-header>

    <q-footer>
      <q-tabs>
        <q-route-tab
          v-for="link in essentialLinks"
          :key="link.title"
          :label="link.title"
          v-bind="link"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      :reveal-offset="767"
      :width="250"
      show-if-above
      bordered
      content-class="bg-primary"
    >
      <q-list dark>
        <q-item-label header class="text-white">Menu</q-item-label>
        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import { mapActions } from "vuex";
import EssentialLink from "components/EssentialLink.vue";
import { openURL } from "quasar";

const linksData = [
  {
    title: "Today",
    icon: "today",
    to: "/today"
  },
  {
    title: "To Do List",
    icon: "list",
    to: "/todo"
  },
  {
    title: "Notes",
    icon: "book",
    to: "/notes"
  },
  {
    title: "Calendar",
    icon: "calendar_today",
    to: "/monthlyoverview"
  },
  {
    title: "Goals",
    icon: "emoji_events",
    to: "/goals"
  },
  {
    title: "Finances",
    icon: "calculate",
    to: "/finances"
  },
  {
    title: "Settings",
    icon: "settings",
    to: "/settings"
  }
];

export default {
  name: "MainLayout",
  components: { EssentialLink },
  data() {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      essentialLinks: linksData
    };
  },
  computed: {
    ...mapState("auth", ["loggedIn"])
  },
  methods: {
    ...mapActions("auth", ["logoutUser"]),
    openURL
  }
};
</script>

<style lang="scss">
@media screen and (min-width: 768px) {
  .q-footer {
    display: none;
  }
}

.q-drawer {
  .q-router-link--exact-active {
    color: white !important;
  }
}
</style>
