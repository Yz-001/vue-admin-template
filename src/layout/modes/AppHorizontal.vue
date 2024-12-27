<template>
  <div :class="`layout layout--${layoutMode} layout-device--${layoutDevice}`">
    <div class="layout-container">
      <BaseHead>
        <BaseMenu :menuList="menuList" mode="horizontal" />
      </BaseHead>

      <AppTabs />
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BaseHead, BaseMenu, AppTabs, AppMain } from "@/layout/component/";
import useLayout from "@/hooks/use-layout";
import useMenu from "@/hooks/use-menu";

const { menuList } = useMenu();
const { layoutDevice, layoutMode } = useLayout();
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
}
</style>
