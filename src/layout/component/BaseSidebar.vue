<script setup lang="ts">
import BaseMark from "@/layout/component/BaseMark.vue";
import BaseMenu from "@/layout/component/BaseMenu.vue";
import { useAppStore } from "@/stores/modules/app";
import useLayout from "@/hooks/use-layout";

defineOptions({
  name: "BaseSidebar"
});
const props = withDefaults(defineProps<{ markVisible?: boolean; menuList?: any[] }>(), {
  markVisible: true,
  menuList: () => []
});
const { setSidebarCollapse } = useAppStore();
const { desktopDevice, sidebarCollapse } = useLayout();
</script>

<template>
  <div :class="['layout-sidebar', sidebarCollapse ? 'layout-sidebar--collapse' : 'layout-sidebar--expand']">
    <BaseMark v-if="markVisible" :collapse="sidebarCollapse" />
    <BaseMenu :collapse="sidebarCollapse" :menuList="menuList" />
    <div v-if="desktopDevice" class="layout-sidebar__collapse">
      <el-icon size="24" color="#999" @click="setSidebarCollapse(!sidebarCollapse)">
        <Expand v-if="sidebarCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-sidebar {
  height: 100%;
  border-right: 2px solid $--border-color-base;

  :deep(.base-menu) {
    width: 100%;
    height: calc(100% - 100px);
    overflow: hidden auto;
  }

  &__collapse {
    height: 50px;
    padding: 6px 10px 0 0;
    line-height: 50px;
    text-align: right;
    border-top: 2px solid $--border-color-regular;

    .el-icon {
      cursor: pointer;
    }
  }

  &--expand {
    // width: 200px;
  }

  &--collapse {
    .layout-sidebar__collapse {
      padding: 6px 0 0;
      text-align: center;
    }

    :deep(.base-menu .menu-title) {
      display: none;
    }
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
  }
}
</style>
