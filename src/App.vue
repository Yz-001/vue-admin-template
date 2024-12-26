<template>
  <el-config-provider :locale="curLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { handleThemeMode, handleThemeStyle } from "@/utils/theme";
import { ElConfigProvider } from "element-plus";
import { useSettingsStore } from "@/stores/modules/settings";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import zhTw from "element-plus/dist/locale/zh-tw.mjs";
import en from "element-plus/dist/locale/en.mjs";
import { checkForUpdate } from "@/utils/common";

const settings = useSettingsStore();
const localeMap = {
  zh: zhCn,
  en: en,
  zhTW: zhTw
};
const curLocale = computed(() => localeMap[settings.locale]);
const { theme, themeMode } = useSettingsStore();

onMounted(() => {
  handleThemeStyle(theme);
  handleThemeMode(themeMode);
  if (import.meta.env.VITE_APP_VERSION_URL) {
    checkForUpdate(import.meta.env.VITE_APP_VERSION_URL);
  }
});
</script>
