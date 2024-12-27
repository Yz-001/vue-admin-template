import { defineStore } from "pinia";
import { layoutModeEnum, layoutDeviceEnum } from "@/apis/interface/common";

export const useAppStore = defineStore("app", {
  state: () => {
    return {
      device: layoutDeviceEnum.DESKTOP as layoutDeviceEnum,
      sidebar: { collapse: false, opened: true } as layoutSidebar,
      layoutMode: layoutModeEnum.VERTICAL as layoutModeEnum
    };
  },
  actions: {
    setSidebarCollapse(collapseBol: boolean) {
      this.sidebar.collapse = collapseBol;
    },
    setSidebarOpened(openedBol: boolean) {
      this.sidebar.opened = openedBol;
    },
    setLayoutMode(mode: layoutModeEnum) {
      if (mode == layoutModeEnum.VERTICAL) {
        //左右侧
        this.setSidebarOpened(true);
      } else if (mode == layoutModeEnum.HORIZONTAL) {
        // 上下侧
        this.setSidebarOpened(false);
      } else if (mode == layoutModeEnum.MIXIN) {
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
        this.device = layoutDeviceEnum.MOBILE;
        this.setSidebarOpened(false);
        this.setSidebarCollapse(false);
      } else if (width > 760 && width <= 990) {
        this.device = layoutDeviceEnum.DESKTOP;
        this.setSidebarOpened(true);
        this.setSidebarCollapse(true);
      } else if (width > 990) {
        this.device = layoutDeviceEnum.DESKTOP;
        this.setSidebarOpened(true);
        this.setSidebarCollapse(false);
      }
      return this.device;
    }
  }
});

export interface layoutSidebar {
  collapse: boolean;
  opened: boolean;
}
