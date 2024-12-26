<script lang="ts" setup>
import useLayout from "@/hooks/use-layout";
import { type ThemeMode } from "@/src/stores/modules/settings";
import { useAppStore } from "@/stores/modules/app";
const { verticalMode, horizontalMode, mixinMode } = useLayout();
const { setLayoutMode } = useAppStore();
const emit = defineEmits(["on-change"]);

const handleModeSwitch = (mode: ThemeMode) => {
  setLayoutMode(mode);
  emit("on-change", mode);
};
</script>

<template>
  <div class="select-layout-mode">
    <el-tooltip content="水平模式">
      <el-container
        class="layout-mode vertical"
        :class="{ active: verticalMode }"
        @click="handleModeSwitch('vertical')"
      >
        <el-aside />
        <el-container>
          <el-header />
          <el-main />
        </el-container>
      </el-container>
    </el-tooltip>
    <el-tooltip content="垂直模式">
      <el-container
        class="layout-mode horizontal"
        :class="{ active: horizontalMode }"
        @click="handleModeSwitch('horizontal')"
      >
        <el-header />
        <el-main />
      </el-container>
    </el-tooltip>
    <el-tooltip content="混合模式">
      <el-container class="layout-mode mixin" :class="{ active: mixinMode }" @click="handleModeSwitch('mixin')">
        <el-header />
        <el-container>
          <el-aside />
          <el-main />
        </el-container>
      </el-container>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.select-layout-mode {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.layout-mode {
  flex-grow: 0;
  width: 25%;
  min-width: 60px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 6px;

  &:hover {
    border: 2px solid var(--el-color-primary);
  }
}

.active {
  border: 2px solid var(--el-color-primary);
}

.el-header {
  height: 12px;
}

.el-aside {
  width: 16px;
}

.vertical {
  .el-header {
    background-color: var(--el-fill-color-darker);
  }

  .el-aside {
    background-color: var(--el-color-primary);
  }

  .el-main {
    background-color: var(--el-fill-color-lighter);
  }
}

.horizontal {
  .el-header {
    background-color: var(--el-color-primary);
  }

  .el-main {
    background-color: var(--el-fill-color-lighter);
  }
}

.mixin {
  .el-header {
    background-color: var(--el-fill-color-darker);
  }

  .el-aside {
    background-color: var(--el-color-primary);
  }

  .el-main {
    background-color: var(--el-fill-color-lighter);
  }
}
</style>
