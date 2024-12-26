import { defineStore } from "pinia";

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return {
      modules: [],
      permissions: [],
      menuList: []
    };
  },
  actions: {
    SET_MODULES(modules: any[]) {
      this.modules = modules;
    },
    SET_PERMISSIONS(permissions: any[]) {
      this.permissions = permissions;
    },
    SET_MENULIST(menuList: any[]) {
      this.menuList = menuList;
    }
  }
});
