import { defineStore } from "pinia";
import type { RouteRecordRaw } from "vue-router";

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return {
      modules: [] as any[],
      permissions: [] as any[],
      menuList: [] as RouteRecordRaw[]
    };
  },
  actions: {
    SET_MODULES(modules: any[]) {
      this.modules = modules;
    },
    SET_PERMISSIONS(permissions: any[]) {
      this.permissions = permissions;
    },
    SET_MENULIST(menuList: RouteRecordRaw[]) {
      this.menuList = menuList || [];
    }
  }
});
