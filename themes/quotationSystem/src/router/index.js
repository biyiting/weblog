import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";

const routes = [
  {
    path: "/",
    component: () => import("@/view/main/index.vue"),
  },
  {
    path: "/micromodule",
    component: () => import("@/view/main/moduleConfig.vue"),
  },
  {
    path: "/quotationConfig",
    component: () => import("@/view/main/quotationConfig.vue"),
  },
  {
    path: "/404",
    component: require("@/view/common/404.vue").default,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});
router.afterEach((to, from) => {
  NProgress.done();
});

export default router;