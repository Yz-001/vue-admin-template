import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
export const NotifRouter: RouteRecordRaw = {
  path: "/notif",
  name: "NotifMain",
  meta: {
    hidden: false,
    icon: "Notification",
    title: "menus.NotifMain"
  },
  component: () => Layout,
  children: [
    {
      path: "list",
      name: "NotifList",
      meta: {
        hidden: false,
        icon: "Tickets",
        title: "menus.NotifList",
        activeMenu: "NotifList",
        tabTitle: "menus.NotifList",
        breadcrumbHide: true,
        allowRepeatTab: false
      },
      component: () => import("@/views/notif/index.vue")
    }
  ]
};
