<template>
  <el-drawer
    class="app-drawer"
    width="30%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    direction="rtl"
    v-bind="$attrs"
    :model-value="visible"
  >
    <slot />
    <template #footer>
      <span class="app-drawer-footer">
        <slot name="footer" />
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ visible: Boolean }>();
const emit = defineEmits([]);
</script>

<style lang="scss">
.app-drawer {
  .el-drawer__title {
    text-align: left;
  }

  &-footer {
    text-align: right;
  }
}
// .el-drawer {
//   &__header {
//     padding: 9px 16px;
//     margin-bottom: 0;
//     font-weight: bold;
//     color: $--text-color-base;
//   }

//   &__body {
//     padding: 14px;
//   }
// }
</style>
