import DiaryVue from "../components/Today/Diary.vue";
import IdeasVue from "../components/Today/Ideas.vue";

export default async ({ Vue }) => {
  Vue.component("DiaryVue", DiaryVue), Vue.component("IdeasVue", IdeasVue);
};
