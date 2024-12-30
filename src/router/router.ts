import { createRouter, type RouteRecordRaw, createWebHashHistory } from "vue-router";
import { BasicRouter } from "./modules/basic";
import { ExploitRouter } from "./modules/exploit";
import { NotifRouter } from "./modules/notif";
// import { encryptQuery, decodeQuery } from "@/utils/cryptoJS";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    meta: { hidden: true, title: "menus.Login" },
    component: () => import("@views/login/index.vue")
  },
  ...BasicRouter,
  NotifRouter,
  ExploitRouter,
  {
    path: "/:pathMatch(.*)*",
    name: "Error",
    meta: { hidden: true, title: "404" },
    component: () => import("@views/error/404.vue")
  }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes
  // stringifyQuery: encryptQuery, // 序列化query参数
  // parseQuery: decodeQuery // 反序列化query参数
});
