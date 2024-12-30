<script setup lang="ts">
import BaseSelectLayoutMode from "@/components/BaseSelectLayoutMode/index.vue";
import { layoutModeType, layoutSidebar, useAppStore } from "@/stores/modules/app";
import { ThemeMode, Locale, useSettingsStore } from "@/stores/modules/settings";
import { handleThemeMode, handleThemeStyle } from "@/utils/theme";
import { onMounted, reactive } from "vue";
import { Moon, Sunny } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import { layoutModeEnum, layoutDeviceEnum } from "@/apis/interface/common";
defineOptions({
  name: "AppLayoutConfig"
});
const visible = defineModel<boolean>("visible");
const form = reactive<LayoutConfigForm>({
  mode: undefined,
  collapse: undefined,
  theme: undefined,
  themeMode: undefined,
  locale: undefined,
  maxTabCount: undefined
});
const handleClose = () => {
  visible.value = false;
};
interface LayoutConfigForm {
  mode: layoutModeType;
  collapse: boolean;
  theme: string;
  themeMode: ThemeMode;
  locale: Locale;
  maxTabCount: Number;
}
const { setSidebarCollapse, device, sidebar, layoutMode } = useAppStore();
const appStore = useAppStore();
const route = useRoute();
const handleModeChange = (mode: layoutModeType) => {
  if (mode == layoutModeEnum.VERTICAL) {
    form.collapse = sidebar.collapse;
  }
  // else if (mode == layoutModeEnum.MIXIN) {
  //   // 设置混合时侧边栏根据有没有子菜单决定是否打开
  //   const hasChildren = route.matched[route.matched.length - 1]?.children;
  //   return setSidebarCollapse(!!hasChildren);
  // }
};
const { theme, SET_THEME, themeMode, SET_THEMEMODE, locale, SET_LOCALE, maxTabCount, SET_MAXTABCOUNT } =
  useSettingsStore();
const handleLayoutConfigGet = () => {
  form.mode = layoutMode;
  if (form.mode == layoutModeEnum.VERTICAL) {
    form.collapse = sidebar.collapse;
  }
  form.theme = theme;
  form.themeMode = themeMode;
  form.locale = locale;
  form.maxTabCount = maxTabCount;
};
const handleThemeChange = (color: string) => {
  SET_THEME(color);
  handleThemeStyle(color);
};
const handleThemeModeChange = (mode: ThemeMode) => {
  SET_THEMEMODE(mode);
  handleThemeMode(mode);
};
const { locale: i18nLocale } = useI18n();
const handleLocaleChange = (newLocale: Locale) => {
  SET_LOCALE(newLocale);
  i18nLocale.value = newLocale;
};
const handleSetMaxTabCountChange = (maxTabCount: number) => {
  SET_MAXTABCOUNT(Number(maxTabCount));
};
onMounted(handleLayoutConfigGet);
</script>

<template>
  <el-drawer
    v-model="visible"
    title="系统默认配置"
    :before-close="handleClose"
    direction="rtl"
    class="layout-config custom"
    width="30%"
  >
    <div class="layout-config__content">
      <el-form :model="form" label-width="130" label-position="left">
        <el-form-item v-if="appStore.device != layoutDeviceEnum.MOBILE" label="布局配置">
          <BaseSelectLayoutMode @onChange="handleModeChange" />
        </el-form-item>
        <el-form-item v-if="form.mode == 'vertical'" label="侧边栏配置">
          <el-radio-group
            v-model="form.collapse"
            class="ml-4"
            :disabled="appStore.device == layoutDeviceEnum.MOBILE"
            @change="setSidebarCollapse"
          >
            <el-radio :value="true" size="large">折叠</el-radio>
            <el-radio :value="false" size="large">展开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="系统主题色">
          <el-color-picker v-model="form.theme" class="ml-4" @change="handleThemeChange" />
        </el-form-item>
        <el-form-item label="系统主题模式" class="mt-[12px]">
          <el-switch
            v-model="form.themeMode"
            class="ml-4"
            :active-action-icon="Moon"
            :inactive-action-icon="Sunny"
            active-value="dark"
            inactive-value="light"
            @change="handleThemeModeChange"
          />
        </el-form-item>
        <el-form-item label="系统语言">
          <el-radio-group v-model="form.locale" class="ml-4" @change="handleLocaleChange">
            <el-radio class="w-full" value="zh">简体中文（zh-cn）</el-radio>
            <el-radio class="w-full" value="en">英语（en）</el-radio>
            <el-radio value="zhTW">繁体中文（zh-tw）</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="最大标签数">
          <el-input-number
            v-model="form.maxTabCount"
            class="ml-4"
            :min="1"
            :max="30"
            :precision="0"
            @change="handleSetMaxTabCountChange"
          />
        </el-form-item>
      </el-form>
      <p class="tip-box">
        <el-icon><Warning /></el-icon> 屏幕适配优先级高于默认布局配置
      </p>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped>
.layout-config {
  &__content {
    display: flex;
    flex-direction: column;
    height: 100%;

    .tip-box {
      display: flex;
      align-items: center;
      padding: 10px;
      margin-top: auto;
      font-size: 14px;
      color: #e9ab4f;
      background-color: #fdf6ec;
      border-radius: 8px;

      .el-icon {
        margin-right: 2px;
      }
    }
  }
}
</style>
