<template>
  <div class="layout-main">
    <router-view v-slot="{ Component, route }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useSettingsStore } from "@/stores/modules/settings";
import { computed } from "vue";
const settingStore = useSettingsStore();
const tabMaps = computed<{ [key: string]: any }>(() => {
  return settingStore.tabMaps || {};
});
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
</script>

<style lang="scss" scoped>
.layout-main {
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background-color: var(--el-bg-color-page);
}

.layout--device--mobile {
  .layout-main {
    height: calc(100% - 50px);
  }
}
</style>
