<template>
  <div class="layout-head">
    <el-icon v-if="mobileDevice" class="layout-head__collapse" size="24" color="#999" @click="mobileSidebarClick">
      <Expand v-if="sidebarOpened" />
      <Fold v-else />
    </el-icon>
    <BaseMark v-if="(desktopDevice && (horizontalMode || mixinMode)) || mobileDevice" :collapse="mobileDevice" />
    <slot />
    <div class="layout-head__right">
      <el-icon @click="toggle"><FullScreen /></el-icon>
      <el-icon @click="handleConfigOpen"><Tools /></el-icon>
      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          {{ userStore.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>修改密码</el-dropdown-item>
            <el-dropdown-item @click="userStore.logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <AppLayoutConfig v-if="configOpenVisible" v-model:visible="configOpenVisible" />
</template>

<script setup lang="ts">
import BaseMark from "@/layout/component/BaseMark.vue";
import AppLayoutConfig from "@/components/AppLayoutConfig.vue";
import { useUserStore } from "@/stores/modules/user";
import { useFullscreen } from "@vueuse/core";
import useLayout from "@/hooks/use-layout.ts";

defineOptions({ name: "BaseHead" });
const emit = defineEmits(["on-mobile-sidebar-click"]);
const userStore = useUserStore();
const mobileSidebarClick = () => {
  emit("on-mobile-sidebar-click");
};
const { layoutDevice, mobileDevice, desktopDevice, layoutMode, horizontalMode, mixinMode, sidebarOpened } = useLayout();
// 顶部右侧配置相关
const { toggle } = useFullscreen();
const configOpenVisible = ref(false);
const handleConfigOpen = () => {
  configOpenVisible.value = true;
};
</script>

<style lang="scss" scoped>
.layout-head {
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 10px 36px 10px 10px;
  color: #fff;
  border-bottom: 3px solid $--border-color-base;

  &__collapse {
    cursor: pointer;
  }

  :deep(.base-menu .el-menu) {
    min-width: 300px;
    height: 48px;
  }

  &__right {
    width: 200px;
    margin-left: auto;
    color: #666;
    text-align: right;

    .el-icon {
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>
