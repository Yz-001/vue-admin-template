import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
export const SystemRouter: RouteRecordRaw = {
  path: "/system",
  name: "SystemMain",
  meta: {
    hidden: false,
    icon: "Setting",
    title: "menus.SystemMain"
  },
  component: Layout,
  children: [
    {
      path: "deptList",
      name: "DeptList",
      meta: {
        hidden: false,
        icon: "Tickets",
        title: "menus.DeptList",
        activeMenu: "DeptList",
        tabTitle: "menus.DeptList",
        breadcrumbHide: true,
        allowRepeatTab: false
      },
      component: () => import("@/views/system/dept/index.vue")
    },
    {
      path: "roleMain",
      name: "RoleMain",
      meta: {
        hidden: false,
        icon: "Tickets",
        title: "menus.RoleMain",
        activeMenu: "RoleMain",
        tabTitle: "menus.RoleMain",
        breadcrumbHide: true,
        allowRepeatTab: false
      },
      component: () => import("@/views/system/role/index.vue")
    }
  ]
};
