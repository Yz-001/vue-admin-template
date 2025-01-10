<template>
  <div v-if="enableTabs" class="layout-tabs">
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
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/modules/settings";
import { getFixationRoutes } from "@/utils/layout";
import useMenu from "@/hooks/use-menu";
import { type TabsPaneContext } from "element-plus";
import { messageWarning } from "@/utils/element-utils/notification-common";
import { RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import { computed, watch } from "vue";

const emit = defineEmits(["on-click", "on-remove"]);
const route = useRoute();
const router = useRouter();
const settingStore = useSettingsStore();
const enableTabs = computed(() => {
  return settingStore.$state.enableTabs;
});
const tabMaps = computed<{ [key: string]: any }>(() => {
  return settingStore.$state.tabMaps || {};
});
const activeTabId = computed(() => {
  return settingStore.$state.activeTabId;
});
const routeTabChange = (toRoute: RouteLocationNormalizedLoaded) => {
  // 普通页面跳转 多开则待新增的tagid
  if (
    settingStore.IS_ALLOW_REPEAT_TAB(toRoute) &&
    !settingStore.IS_EXIST_TABID(settingStore.GET_TABID(toRoute) || "")
  ) {
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
    const newTab = settingStore.ADD_TAB(toRoute, toRoute.params?.tagId ? Number(toRoute.params?.tagId) : null);
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
// const { menuList } = useMenu();
// const createFixationTabData = () => {
//   // 创建固定tab --初始时调用
//   const fixations = menuList.value ? getFixationRoutes(menuList.value) : [];
//   if (fixations?.length) {
//     fixations.forEach((item, index) => {
//       // 排除掉当前页
//       if (item?.path != route.path) {
//         settingStore.ADD_TAB(item, index);
//       }
//     });
//   }
// };
const handleTabClick = (pane: TabsPaneContext) => {
  // 修改注意需要兼容handleTabsRemove的调用
  const curRoute = settingStore.GET_TAB_INFO(String(pane.paneName));
  router.push(curRoute);
  emit("on-click", curRoute);
};
const handleTabsRemove = async (tagId: string) => {
  await settingStore.REMOVE_TAB(tagId);
  const tabKeys = Object.keys(tabMaps.value).map(i => Number(i));
  const nextTagId = tabKeys?.sort()?.find(it => it > Number(tagId));
  const maxTagId = Math.max(...tabKeys);
  handleTabClick({ paneName: nextTagId ? nextTagId : maxTagId } as TabsPaneContext);
  emit("on-remove", tagId);
};
const handleNoFixationClear = () => {
  // 关闭所有非固定TAB
  settingStore.CLEAR_NOFIXATION_TABS();
  router.push("/");
};
</script>

<style lang="scss" scoped>
.layout-tabs {
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
</style>
