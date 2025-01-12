<script setup lang="ts">
import { type RouteLocationNormalizedLoaded, useRoute, useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/modules/settings";
import { messageWarning } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { useAppStore } from "@/stores/modules/app";
import useLayout from "@/hooks/use-layout";
import { computed } from "vue";
import { type RouteRecordRaw } from "vue-router";

defineOptions({ name: "BaseMenu" });
const props = withDefaults(
  defineProps<{ menuList?: RouteRecordRaw[]; collapse?: boolean; mode?: "horizontal" | "vertical" }>(),
  {
    menuList: () => [],
    collapse: false,
    mode: "vertical"
  }
);
const route = useRoute();
const router = useRouter();
const { mixinMode } = useLayout();
const defaultActiveMenu = computed(() => {
  // 混合head菜单只展示一级 所以聚焦也是一级判定
  if (mixinMode.value && props.mode == "horizontal") {
    return !route.matched?.[0]?.name ? "Home" : route.matched?.[0]?.name;
  }
  return route.meta?.activeMenu || "";
});
const settingStore = useSettingsStore();
const appStore = useAppStore();
const emit = defineEmits(["on-mixin-menu-click"]);
const handleMenuClick = (route: RouteLocationNormalizedLoaded) => {
  // 混合的二级点击
  if (mixinMode.value && props.mode == "horizontal") {
    emit("on-mixin-menu-click", route);
    return;
  }
  if (settingStore.IS_OVER_MAXTAGCOUNT()) {
    messageWarning(`打开页面请勿超过${settingStore.maxTabCount}个！`);
    return;
  }
  // if (!settingStore.IS_ALLOW_REPEAT_TAB(route)) {
  //   messageWarning(`${route.meta?.title ? $t(String(route.meta.title)) : ""}不允许多开，已为你跳转至打开页面`);
  //   return;
  // }
  if (route.meta?.outLink) {
    window.open(route.meta.outLink as string);
  } else {
    // 允许多开的加tagid区分
    if (route.meta?.allowRepeatTab) {
      if (route.params) {
        route.params.tagId = settingStore.CREATE_NEW_TAGID();
      } else {
        route["params"] = {
          tagId: settingStore.CREATE_NEW_TAGID()
        };
      }
    }
    router.push(route);
  }
};
</script>

<template>
  <div class="base-menu" :mode="mode">
    <el-menu :default-active="defaultActiveMenu" :collapse="collapse" :mode="mode" :collapse-transition="false">
      <template v-for="(item, index) in menuList" :key="index">
        <el-sub-menu v-if="item?.children?.length" :index="item?.name">
          <template #title>
            <el-icon v-if="item?.meta?.icon">
              <component :is="item.meta.icon" />
            </el-icon>
            <span class="menu-title">{{ item?.meta?.title ? $t(item.meta.title) : "" }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(childItem, childIndex) in item?.children"
              v-show="childItem"
              :key="childIndex"
              :index="childItem?.name"
              class="menu-title"
              @click="handleMenuClick(childItem)"
            >
              {{ childItem?.meta?.title ? $t(childItem.meta.title) : "" }}
              <el-icon v-if="childItem?.meta?.allowRepeatTab" class="ml-auto" size="12" title="此页面允许多开">
                <CopyDocument />
              </el-icon>
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <el-menu-item v-else :index="item?.name" @click="handleMenuClick(item)">
          <el-icon v-if="item?.meta?.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <template #title>
            <span class="menu-title">
              {{ item?.meta?.title ? $t(item.meta.title) : "" }}
              <el-icon v-if="item?.meta?.allowRepeatTab" class="ml-auto" size="12" title="此页面允许多开">
                <CopyDocument />
              </el-icon>
            </span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.base-menu {
  --el-menu-item-height: 50px;
  --el-menu-base-level-padding: 16px;
  // &[mode="vertical"] {
  //   .menu-title {
  //     // width: calc(100% - 16px);
  //     // padding-left: 10px;
  //   }
  // }

  :deep(.el-menu) {
    height: 100%;
    border: none;
  }

  .el-menu-item.is-active,
  .el-sub-menu.is-active .el-sub-menu__title,
  .el-menu--collapse .el-sub-menu.is-active,
  :deep(.el-menu--collapse .el-sub-menu.is-active .el-sub-menu__title:hover) {
    background-color: var(--el-color-primary-light-9);
    border-radius: $--border-size-radius-base;
  }

  :deep(.el-menu-item-group__title) {
    display: none;
  }

  .el-menu--horizontal {
    --el-menu-active-color: var(--el-color-primary);
  }
}

.dark {
  .base-menu .el-menu-item.is-active {
    background-color: var(--el-color-primary-dark-9);
  }

  .base-menu .el-menu-item:hover:not(.is-active) {
    color: var(--el-color-black);
  }
}
</style>

<style lang="scss">
.dark {
  .base-menu .el-sub-menu__title:hover {
    color: var(--el-color-black);
  }
}
</style>
