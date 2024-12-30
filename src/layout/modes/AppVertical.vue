<template>
  <div :class="`layout layout--${layoutMode} layout-device--${layoutDevice}`">
    <BaseSidebar v-if="desktopDevice && sidebarOpened" :menuList="menuList" />
    <el-drawer
      v-if="mobileDevice"
      v-model="mobileSidebarVisible"
      direction="ltr"
      :with-header="false"
      class="layout-sidebar--mobile"
    >
      <BaseSidebar :menuList="menuList" />
    </el-drawer>

    <div class="layout-container">
      <BaseHead @on-mobile-sidebar-click="mobileSidebarClick">
        <BaseBreadCrumb />
      </BaseHead>
      <AppTabs />
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BaseHead, BaseSidebar, AppTabs, AppMain } from "@/layout/component/";
import useLayout from "@/hooks/use-layout.ts";
import useMenu from "@/hooks/use-menu";
import BaseBreadCrumb from "@/components/BaseBreadCrumb/index.vue";

const { menuList } = useMenu();
const { layoutDevice, mobileDevice, desktopDevice, layoutMode, sidebarOpened } = useLayout();
const mobileSidebarVisible = ref(false);
const mobileSidebarClick = () => {
  mobileSidebarVisible.value = !mobileSidebarVisible.value;
};
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

    .layout-main {
      height: calc(100% - 50px - 42px);
    }
  }

  &-device--mobile {
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
