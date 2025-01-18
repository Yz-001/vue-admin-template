<template>
  <div class="layout">
    <BaseHead />
    <div class="layout-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BaseHead from "./component/BaseHead.vue";
import { onMounted } from "vue";
onMounted(() => {
  console.log("进入home");
});
</script>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  overflow: hidd &-container {
    width: 100%;
    height: calc(100vh - 150px);
    overflow: auto;
    background-color: var(--el-bg-color-page);
  }
}
</style>
