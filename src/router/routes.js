const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/today",
        component: () => import("pages/Today.vue")
      },
      {
        path: "/settings",
        component: () => import("pages/Settings.vue")
      },
      {
        path: "/settings/help",
        component: () => import("pages/HelpPage.vue")
      },
      {
        path: "/auth",
        component: () => import("pages/LoginRegisterPage.vue")
      },
      { path: "/todo", component: () => import("pages/ToDo.vue") },
      { path: "/notes", component: () => import("pages/Notes.vue") },
      {
        path: "/monthlyoverview",
        component: () => import("pages/MonthlyOverview.vue")
      },
      { path: "/finances", component: () => import("pages/Finances.vue") },
      { path: "/goals", component: () => import("pages/Goals.vue") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
