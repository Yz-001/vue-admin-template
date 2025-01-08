<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

defineOptions({
  name: "LayoutIframe"
});
const route = useRoute();
const iframeLink = computed(() => {
  return route?.meta?.iframeLink as string;
});
</script>

<template>
  <iframe class="layout-iframe" :src="iframeLink" frameborder="0" />
</template>

<style lang="scss" scoped>
.layout-iframe {
  width: 100%;
  height: 100%;
  padding: 10px;
  background-color: var(--el-bg-color-overlay);
}
</style>
