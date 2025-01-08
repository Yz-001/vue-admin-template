<template>
  <AppVertical v-if="mobileDevice || (desktopDevice && verticalMode)" />
  <AppHorizontal v-if="horizontalMode" />
  <AppMixin v-if="mixinMode" />
</template>

<script lang="ts" setup>
import AppVertical from "@/layout/modes/AppVertical.vue";
import AppHorizontal from "@/layout/modes/AppHorizontal.vue";
import AppMixin from "@/layout/modes/AppMixin.vue";
import { useAppStore } from "@/stores/modules/app";
import { useWindowSize } from "@vueuse/core";
import useLayout from "@/hooks/use-layout";
import useMenu from "@/hooks/use-menu";
import { onMounted, watch } from "vue";
import { type RouteLocationNormalizedLoaded, useRouter } from "vue-router";

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
const appStore = useAppStore();
watch(
  width,
  (newVal, oldVal) => {
    if (newVal != oldVal) {
      appStore.updateDevice(newVal);
    }
  },
  {
    immediate: true
  }
);

// 菜单初始化
const router = useRouter();
const { setMenuList } = useMenu();
onMounted(() => {
  setMenuList(router.options.routes as unknown as RouteLocationNormalizedLoaded);
});
</script>
