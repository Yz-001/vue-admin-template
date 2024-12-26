<template>
  <div :class="`layout layout--${layoutMode} layout-device--${layoutDevice}`">
    <BaseSidebar v-if="(verticalMode || mixinMode) && desktopDevice && sidebarOpened" :menuList="sidebarMenu" />
    <el-drawer v-model="mobileSidebarVisible" direction="ltr" :with-header="false" class="layout-sidebar--mobile">
      <BaseSidebar :menuList="sidebarMenu" />
    </el-drawer>

    <div class="layout-container">
      <BaseHead @on-mobile-sidebar-click="mobileSidebarClick">
        <BaseMenu
          v-if="(horizontalMode || mixinMode) && desktopDevice"
          :menuList="headMenu"
          mode="horizontal"
          @on-mixin-menu-click="handleMixinMenuChange"
        />
        <BaseBreadCrumb v-if="mobileDevice || (desktopDevice && verticalMode)" />
      </BaseHead>

      <div class="layout-tabs">
        <el-tabs v-model="activeTabId" type="card" @tab-click="handleTabClick" @tab-remove="handleTabsRemove">
          <el-tab-pane
            v-for="key in Object.keys(tabMaps)"
            :key="key"
            :label="tabMaps[key]?.meta?.tabTitle ? $t(tabMaps[key].meta.tabTitle) : ''"
            :name="key"
            :closable="!tabMaps[key]?.meta?.tabFixation"
          />
        </el-tabs>
        <el-dropdown class="layout-tabs__more">
          <span class="el-dropdown-link">
            <el-icon>
              <More />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleNoFixationClear">清除所有标签</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="layout-content">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAppStore } from "@/stores/modules/app";
import BaseSidebar from "./component/BaseSidebar.vue";
import BaseMenu from "./component/BaseMenu.vue";
import BaseHead from "./component/BaseHead.vue";
import { useWindowSize } from "@vueuse/core";
import useLayout from "@/hooks/use-layout.ts";
import BaseBreadCrumb from "@/components/BaseBreadCrumb.vue";
import { useSettingsStore } from "@/stores/modules/settings";
import { usePermissionStore } from "@/stores/modules/permission";
import { messageWarning } from "@/utils/element-utils/notification-common";
import { type TabsPaneContext } from "element-plus";
import { type RouteLocationNormalizedLoaded } from "vue-router";
import { deepCopy } from "@/utils/common";
import { filterHiddenRoutes, getFixationRoutes, getNodeOrParentChildren } from "@/utils/layout";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const settingStore = useSettingsStore();

// 窗口模式相关
const { width, height } = useWindowSize();
const {
  layoutDevice,
  mobileDevice,
  desktopDevice,
  layoutMode,
  verticalMode,
  horizontalMode,
  mixinMode,
  sidebarOpened
} = useLayout();
const mobileSidebarVisible = ref(false);
const mobileSidebarClick = () => {
  mobileSidebarVisible.value = !mobileSidebarVisible.value;
};
watch(
  width,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      appStore.updateDevice(newVal);
      if (desktopDevice.value) {
        mobileSidebarVisible.value = false;
      }
    }
  },
  {
    immediate: true
  }
);
watch(layoutMode, () => {
  setLayoutMenu();
});
watch(layoutDevice, () => {
  //   router.go(0);
  setLayoutMenu();
});

// TAB相关
const tabMaps = computed<{ [key: string]: any }>(() => {
  return settingStore.tabMaps || {};
});
const activeTabId = computed(() => {
  return settingStore.activeTabId;
});
const routeTabChange = toRoute => {
  // 普通页面跳转 多开则待新增的tagid
  if (settingStore.IS_ALLOW_REPEAT_TAB(toRoute) && !settingStore.IS_EXIST_TABID(settingStore.GET_TABID(toRoute))) {
    // 二次捕获最大页面限制
    if (settingStore.IS_OVER_MAXTAGCOUNT()) {
      messageWarning(`打开页面请勿超过${settingStore.maxTabCount}个！`);
      router.back();
      return;
    }
    // 拦截手动修改TAGID情况
    if (toRoute?.params?.tagId && !settingStore.IS_LEGAL_TABID(String(toRoute?.params?.tagId))) {
      messageWarning(`打开页面的方式不正确，请使用正确打开页面方式！`);
      router.push("/404");
      return;
    }
    const newTab = settingStore.ADD_TAB(toRoute, toRoute.params?.tagId ? toRoute.params?.tagId : null);
    settingStore.SET_ACTIVE_TABID(newTab.tagId);
  } else {
    // 不允许多开的跳转 回到已有TAG
    settingStore.SET_ACTIVE_TABID(settingStore.GET_TABID(toRoute));
  }
};
watch(
  () => route,
  toRoute => {
    routeTabChange(toRoute);
  },
  {
    immediate: true,
    deep: true
  }
);
const createFixationTabData = () => {
  // 创建固定tab --初始时调用
  const fixations = menuList.value ? getFixationRoutes(menuList.value) : [];
  if (fixations?.length) {
    fixations.forEach((item, index) => {
      // 排除掉当前页
      if (item.path != route.path) {
        settingStore.ADD_TAB(item, index);
      }
    });
  }
};
const handleTabClick = (pane: TabsPaneContext) => {
  // 修改注意需要兼容handleTabsRemove的调用
  const curRoute = settingStore.GET_TAB_INFO(String(pane.paneName));
  router.push(curRoute);
  if (desktopDevice.value && mixinMode.value) {
    handleMixinMenuChange(curRoute);
  }
};
const handleTabsRemove = async (tagId: string) => {
  await settingStore.REMOVE_TAB(tagId);
  const tabKeys = Object.keys(tabMaps.value).map(i => Number(i));
  const nextTagId = tabKeys?.sort()?.find(it => it > Number(tagId));
  const maxTagId = Math.max(...tabKeys);
  handleTabClick({ paneName: nextTagId ? nextTagId : maxTagId } as TabsPaneContext);
};
const handleNoFixationClear = () => {
  // 关闭所有非固定TAB
  settingStore.CLEAR_NOFIXATION_TABS();
  router.push("/");
};

// MENU相关
const menuList = shallowRef(); //总菜单
const sidebarMenu = ref([]); //侧边栏菜单
const headMenu = ref([]); //顶部栏菜单
const handleMenuListGet = async () => {
  let list = await filterHiddenRoutes(router.options.routes);
  // 单独处理Home
  list = list.map(i => {
    if (i.path == "") {
      return i.children.find(c => c.name == "Home");
    } else {
      return i;
    }
  });
  const { SET_MENULIST } = usePermissionStore();
  SET_MENULIST(list);
  menuList.value = list;
  createFixationTabData();
  setLayoutMenu();
};
const setLayoutMenu = () => {
  const list = deepCopy(menuList.value) || [];
  if (mobileDevice.value) {
    sidebarMenu.value = list;
    headMenu.value = [];
  } else {
    if (verticalMode.value) {
      sidebarMenu.value = list;
    } else if (horizontalMode.value) {
      headMenu.value = list;
    } else if (mixinMode.value) {
      const headList = deepCopy(list);
      headMenu.value = headList.map(i => {
        if (i.children) delete i.children;
        return i;
      });
      handleMixinMenuChange(route);
    }
  }
};
const handleMixinMenuChange = (changeRoute: RouteLocationNormalizedLoaded) => {
  const parentRoute = getNodeOrParentChildren({ children: deepCopy(menuList.value) }, changeRoute.name);
  sidebarMenu.value = parentRoute.children || [];
  appStore.setSidebarOpened(!!sidebarMenu.value.length);
  // 没有二级则直接跳转到一级路由
  if (!sidebarMenu.value.length) {
    router.push({ name: changeRoute?.name });
  }
};

// keep-alive组件缓存相关
const cachedViews = computed(() => {
  const cachedList = Object.keys(tabMaps.value || {})
    .filter(key => {
      const hasNoCacheAttr = Object.hasOwn(tabMaps.value[key]?.meta, "noCache");
      return !hasNoCacheAttr || (hasNoCacheAttr && !tabMaps.value[key].meta.noCache);
    })
    .map(key => tabMaps.value[key]?.name)
    .filter(Boolean);
  return Array.from(new Set(cachedList));
});

onMounted(() => {
  handleMenuListGet();
});
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &-container {
    width: 100%;
    height: 100%;
    overflow: auto;

    .layout-content {
      width: 100%;
      height: calc(100% - 50px - 40px);
      padding: 10px;
      overflow-y: auto;
      background-color: var(--el-bg-color-page);
    }
  }

  &-tabs {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 6px 10px;

    &__more {
      width: 50px;
      padding-left: 10px;
      line-height: 30px;

      .el-icon {
        width: 100%;
        transform: rotate(90deg);
      }
    }

    :deep(.el-tabs) {
      --el-tabs-header-height: 28px;

      width: calc(100% - 50px);

      .el-tabs__nav-next,
      .el-tabs__nav-prev {
        height: 30px;
        line-height: 30px !important;
      }
    }

    :deep(.el-tabs__header) {
      margin: 0 !important;
      border-bottom: 0;
    }

    :deep(.el-tabs__item) {
      margin-right: 6px;
      border: 1px solid $--border-color-regular !important;
      border-bottom: 1px solid $--border-color-regular !important;
    }

    :deep(.el-tabs__nav) {
      border: none !important;
    }
  }

  &-device--mobile {
    .layout-content {
      height: calc(100% - 50px);
    }

    :deep(.layout-sidebar--mobile) {
      width: 200px !important;

      .el-drawer__body {
        width: 200px;
        padding: 0;
      }
    }
  }
}
</style>
