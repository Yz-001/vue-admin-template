<template>
  <div :class="`layout layout--${layoutMode} layout-device--${layoutDevice}`">
    <BaseHead>
      <BaseMenu :menuList="headMenu" mode="horizontal" @on-mixin-menu-click="handleMixinMenuChange" />
    </BaseHead>
    <div class="layout-container">
      <BaseSidebar
        v-show="sidebarMenu.length"
        class="layout-container__left"
        :markVisible="false"
        :menuList="sidebarMenu"
      />
      <div class="layout-container__right">
        <AppTabs @onClick="handleMixinMenuChange" />
        <AppMain />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BaseHead, BaseSidebar, BaseMenu, AppTabs, AppMain } from "@/layout/component/";
import useLayout from "@/hooks/use-layout";
import useMenu from "@/hooks/use-menu";
import { useAppStore } from "@/stores/modules/app";
import { deepCopy } from "@/utils/common";
import { getNodeOrParentChildren } from "@/utils/layout";
import { useRoute, useRouter, type RouteLocationNormalizedLoaded } from "vue-router";
import { onMounted, ref } from "vue";

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const { layoutDevice, layoutMode } = useLayout();
const { menuList } = useMenu();

const sidebarMenu = ref([]); //侧边栏菜单
const headMenu = ref([]); //顶部栏菜单
const setLayoutMenu = () => {
  const headList = deepCopy(menuList.value);
  headMenu.value = headList.map(i => {
    if (i.children) delete i.children;
    return i;
  });
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

onMounted(() => {
  setLayoutMenu();
  handleMixinMenuChange(route);
});
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &-container {
    display: flex;
    width: 100%;
    height: calc(100% - 54px);
    overflow: auto;

    &__left {
      // width: 200px;
      height: 100%;
    }

    &__right {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      height: 100%;

      .layout-main {
        flex-grow: 1;
      }
    }

    :deep(.layout-sidebar .base-menu) {
      height: calc(100% - 50px);
    }
    // :deep(.layout-sidebar--collapse) {
    //   width: 56px;
    // }
    // :deep(.layout-sidebar--expand) {
    //   width: 200px;
    // }
  }

  :deep(.layout-head .layout-mark) {
    padding-left: 2px;
  }
}
</style>
