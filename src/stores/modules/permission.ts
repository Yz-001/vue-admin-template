import { defineStore } from "pinia";

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return {
      modules: [] as any[],
      permissions: [] as any[],
      menuList: [] as any[]
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
