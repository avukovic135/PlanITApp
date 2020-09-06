<template>
  <q-page padding>
    <div class="flex flex-center">
      <q-card style="width:700px">
        <q-tabs
          v-model="tab"
          class="text-grey-9"
          active-color="secondary"
          indicator-color="secondary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="diary" label="Diary" />
          <q-tab name="ideas" label="Ideas and Thoughts" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="diary">
            <div class="text-h6 flex flex-center">Write something you would like to remember!</div>
            <DiaryVue />
          </q-tab-panel>

          <q-tab-panel name="ideas">
            <div class="text-h6 flex flex-center">Keep track of all your great ideas!</div>
            <IdeasVue></IdeasVue>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      tab: "diary"
    };
  }
};
</script>

<style >
</style>