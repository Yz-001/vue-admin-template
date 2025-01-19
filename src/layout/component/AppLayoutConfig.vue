<script setup lang="ts">
import BaseSelectLayoutMode from "@/components/BaseSelectLayoutMode/index.vue";
import { useAppStore } from "@/stores/modules/app";
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
  enableTabs: undefined,
  theme: undefined,
  themeMode: undefined,
  locale: undefined,
  maxTabCount: undefined
});
const handleClose = () => {
  visible.value = false;
};
interface LayoutConfigForm {
  mode: layoutModeEnum | undefined;
  collapse: boolean | undefined;
  enableTabs: boolean | undefined;
  theme: string | undefined;
  themeMode: ThemeMode | undefined;
  locale: Locale | undefined;
  maxTabCount: Number | undefined;
}
const { setSidebarCollapse, device, sidebar, layoutMode } = useAppStore();
const appStore = useAppStore();
const handleModeChange = (mode: layoutModeEnum) => {
  if (mode == layoutModeEnum.VERTICAL) {
    form.collapse = sidebar.collapse;
  }
  // else if (mode == layoutModeEnum.MIXIN) {
  //   // 设置混合时侧边栏根据有没有子菜单决定是否打开
  //   const hasChildren = route.matched[route.matched.length - 1]?.children;
  //   return setSidebarCollapse(!!hasChildren);
  // }
};
const {
  theme,
  SET_THEME,
  themeMode,
  SET_THEMEMODE,
  locale,
  SET_LOCALE,
  maxTabCount,
  SET_MAXTABCOUNT,
  enableTabs,
  SET_ENABLETABS
} = useSettingsStore();
const handleLayoutConfigGet = () => {
  form.enableTabs = enableTabs;
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
const handleEnableTabsBolChange = (bol: boolean) => {
  SET_ENABLETABS(bol);
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
  <AppDrawer
    :visible="visible"
    :title="$t('layoutConfig.system_default_config')"
    :before-close="handleClose"
    direction="rtl"
    class="layout-config custom"
  >
    <div class="layout-config__content">
      <el-form :model="form" label-width="130" label-position="left">
        <el-form-item v-if="appStore.device != layoutDeviceEnum.MOBILE" :label="$t('layoutConfig.layout_config')">
          <BaseSelectLayoutMode @onChange="handleModeChange" />
        </el-form-item>
        <el-form-item v-if="form.mode == layoutModeEnum.VERTICAL" :label="$t('layoutConfig.sidebar_config')">
          <el-radio-group
            v-model="form.collapse"
            class="ml-4"
            :disabled="appStore.device == layoutDeviceEnum.MOBILE"
            @change="setSidebarCollapse"
          >
            <el-radio :value="true" size="large">{{ $t("layoutConfig.collapse") }}</el-radio>
            <el-radio :value="false" size="large">{{ $t("layoutConfig.expand") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('layoutConfig.enable_tabs')" class="mt-[12px]">
          <el-switch
            v-model="form.enableTabs"
            class="ml-4"
            :active-value="true"
            :inactive-value="false"
            @change="handleEnableTabsBolChange"
          />
        </el-form-item>
        <el-form-item :label="$t('layoutConfig.theme_color')">
          <el-color-picker v-model="form.theme" class="ml-4" @change="handleThemeChange" />
        </el-form-item>
        <el-form-item :label="$t('layoutConfig.theme_mode')" class="mt-[12px]">
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
        <el-form-item :label="$t('layoutConfig.language')">
          <el-radio-group v-model="form.locale" class="ml-4" @change="handleLocaleChange">
            <el-radio class="w-full" value="zh">{{ $t("layoutConfig.simplified_chinese") }}</el-radio>
            <el-radio class="w-full" value="en">{{ $t("layoutConfig.english") }}</el-radio>
            <el-radio value="zhTW">{{ $t("layoutConfig.traditional_chinese") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('layoutConfig.max_tab_count')">
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
        <el-icon><Warning /></el-icon> {{ $t("layoutConfig.tip_box") }}
      </p>
    </div>
  </AppDrawer>
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
