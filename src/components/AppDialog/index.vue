<template>
  <el-dialog
    class="app-dialog"
    width="50%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-bind="$attrs"
    :model-value="visible"
  >
    <slot />
    <template #footer>
      <span class="app-dialog-footer">
        <slot name="footer" />
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ visible: Boolean }>();
const emit = defineEmits([]);
</script>

<style lang="scss" scoped>
.app-dialog {
  &-footer {
    text-align: right;
  }
}
// :deep(.el-dialog .app-dialog) {
//   border-radius: 8px;
//   border: 1px solid red;

//   &__title {
//     font-weight: bold;
//     color: $--text-color-base;

//     &::before {
//       position: relative;
//       top: 3px;
//       left: -5px;
//       display: inline-block;
//       width: 4px;
//       height: 18px;
//       content: "";
//       background: var(--el-color-primary);
//       border-radius: 3px;
//     }
//   }

//   &__body {
//     padding: 9px 0;
//   }

//   &__footer {
//     padding-top: 0;
//   }
// }
</style>
