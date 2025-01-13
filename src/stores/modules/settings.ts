import { deepCopy, isValidNumericTimestamp } from "@/utils/common";
import { defineStore } from "pinia";
import type { RouteRecordRaw, RouteLocationNormalizedLoaded } from "vue-router";

export const useSettingsStore = defineStore("settings", {
  state: () => {
    return {
      theme: "#4248F4",
      themeMode: "light" as ThemeMode,
      locale: Locale.ZH as Locale,
      enableTabs: true as boolean,
      tabMaps: {} as { [key: string]: RouteRecordRaw }, // tabs集合
      tabRouteNames: [] as string[], //tab中name集合
      maxTabCount: 15, // 最大标签数
      activeTabId: undefined as string | undefined
    };
  },
  actions: {
    SET_THEME(theme: string) {
      this.theme = theme;
    },
    SET_THEMEMODE(themeMode: ThemeMode) {
      this.themeMode = themeMode;
    },
    SET_LOCALE(locale: Locale) {
      this.locale = locale;
    },
    SET_ENABLETABS(bol: boolean) {
      this.enableTabs = bol;
    },
    SET_ACTIVE_TABID(tagId: string) {
      this.activeTabId = tagId;
    },
    SET_MAXTABCOUNT(count: number) {
      this.maxTabCount = count;
    },
    IS_OVER_MAXTAGCOUNT() {
      // 判断是否超出最大标签数
      return Object.keys(this.tabMaps).length >= this.maxTabCount;
    },
    IS_ALLOW_REPEAT_TAB(route: RouteLocationNormalizedLoaded) {
      // 判断此标签是否允许被重复打开；返回：true 允许多开，false 不允许多开；
      const hasAllowRepeatTabAttr = Object.hasOwn(route.meta, "allowRepeatTab");
      if (!hasAllowRepeatTabAttr || (hasAllowRepeatTabAttr && !route.meta.allowRepeatTab)) {
        if (this.tabRouteNames.includes(String(route.name))) {
          return false;
        }
      }
      return true;
    },
    IS_EXIST_TABID(tagId: string) {
      // 判断TABID是否已存在
      return Object.keys(this.tabMaps)?.includes(tagId);
    },
    IS_LEGAL_TABID(tagId: string) {
      // 判断是否是合法TABID true合法 false不合法; 防止手动修改router传参;
      if (tagId == undefined || tagId == null) return false;
      const hasTab = this.IS_EXIST_TABID(tagId);
      return hasTab || (!hasTab && isValidNumericTimestamp(Number(tagId)));
    },
    GET_TABID(route: RouteLocationNormalizedLoaded) {
      // 根据route=>value 获取对应TABID
      if (Object.keys(this.tabMaps).length) {
        return Object.keys(this.tabMaps).find(key => this.tabMaps?.[key]?.path == route.path);
      }
      return null;
    },
    CREATE_NEW_TAGID() {
      // 创建TABID
      return String(Date.now());
    },
    ADD_TAB(route: RouteLocationNormalizedLoaded, customTagId: string | null = null) {
      // 创建TAB
      const newTagId = customTagId != null ? customTagId : this.CREATE_NEW_TAGID();
      this.tabMaps[newTagId] = deepCopy(route);
      if (!this.tabRouteNames.includes(String(route.name))) this.tabRouteNames.push(String(route.name));
      return { tagId: newTagId, value: this.GET_TAB_INFO(String(newTagId)) };
    },
    GET_TAB_INFO(tagId: string) {
      return deepCopy(this.tabMaps[tagId]);
    },
    REMOVE_TAB(tagId: string) {
      if (!tagId) return;
      const oldMaps = {} as { [key: string]: any };
      if (Object.keys(this.tabMaps).length) {
        Object.keys(this.tabMaps).forEach(key => {
          if (key != tagId) {
            oldMaps[key] = deepCopy(this.tabMaps[key]);
          }
        });
      }
      this.tabMaps = oldMaps;
      this.tabRouteNames = this.tabRouteNames.filter(i => i != tagId);
    },
    CLEAR_NOFIXATION_TABS() {
      const fixationTabMaps = {} as { [key: string]: any };
      const fixationNames = [] as string[];
      if (Object.keys(this.tabMaps).length) {
        Object.keys(this.tabMaps).forEach((key: string) => {
          const item = deepCopy(this.tabMaps[key]);
          if (Object.hasOwn(item?.meta, "tabFixation") && item?.meta?.tabFixation) {
            fixationTabMaps[key] = item;
            fixationNames.push(item.name);
          }
        });
      }
      this.tabMaps = fixationTabMaps;
      this.tabRouteNames = fixationNames;
    },
    CLEAR_TABS() {
      this.tabMaps = {};
      this.tabRouteNames = [];
    }
  },
  persist: {
    //key的名称
    key: "setting",
    //更改默认存储，我更改为localStorage
    storage: sessionStorage,
    // 可以选择哪些进入local存储，这样就不用全部都进去存储了
    // 默认是全部进去存储
    // 暂存 "tabMaps", "tabRouteNames"
    paths: []
  }
});

export type ThemeMode = "light" | "dark";
export enum Locale {
  ZH = "zh",
  EN = "en",
  ZHTW = "zh-TW"
}

// interface MenuTab{
//   path:string;
//   name:string;
//   meta:RouteRecordRaw;
//   component:Function;
// }
