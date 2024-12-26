import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      device: "",
      sidebar: { collapse: false, opened: true } as layoutSidebar,
      layoutMode: "vertical" as layoutModeType
    };
  },
  actions: {
    setSidebarCollapse(collapseBol: boolean) {
      this.sidebar.collapse = collapseBol;
    },
    setSidebarOpened(openedBol: boolean) {
      this.sidebar.opened = openedBol;
    },
    setLayoutMode(mode: layoutModeType) {
      if (mode == "vertical") {
        //左右侧
        this.setSidebarOpened(true);
      } else if (mode == "horizontal") {
        // 上下侧
        this.setSidebarOpened(false);
      } else if (mode == "mixin") {
        // 混合
      }
      this.layoutMode = mode;
    },
    updateDevice(width: number) {
      /** width app-wrapper类容器宽度
       * 0 < width <= 760 隐藏侧边栏
       * 760 < width <= 990 折叠侧边栏
       * width > 990 展开侧边栏
       */
      if (width <= 768) {
        this.device = "mobile";
        this.setSidebarOpened(false);
        this.setSidebarCollapse(false);
      } else if (width > 760 && width <= 990) {
        this.device = "desktop";
        this.setSidebarOpened(true);
        this.setSidebarCollapse(true);
      } else if (width > 990) {
        this.device = "desktop";
        this.setSidebarOpened(true);
        this.setSidebarCollapse(false);
      }
      return this.device;
    }
  }
});

export type layoutModeType = "vertical" | "horizontal" | "mixin";
export type layoutDeviceType = "mobile" | "desktop";
export interface layoutSidebar {
  collapse: boolean;
  opened: boolean;
}
