<template>
  <el-config-provider :locale="curLocale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts" setup>
import { handleThemeMode, handleThemeStyle } from "@/utils/theme";
import { ElConfigProvider } from "element-plus";
import { Locale, useSettingsStore } from "@/stores/modules/settings";
import { computed, onMounted } from "vue";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import zhTw from "element-plus/dist/locale/zh-tw.mjs";
import en from "element-plus/dist/locale/en.mjs";
import { checkForUpdate } from "@/utils/common";

const settings = useSettingsStore();
const localeMap = {
  [Locale.ZH]: zhCn,
  [Locale.EN]: en,
  [Locale.ZHTW]: zhTw
};
const curLocale = computed(() => localeMap[settings.$state.locale]);
const { theme, themeMode } = useSettingsStore();

onMounted(() => {
  handleThemeStyle(theme);
  handleThemeMode(themeMode);
  if (import.meta.env.VITE_APP_VERSION_URL) {
    checkForUpdate(import.meta.env.VITE_APP_VERSION_URL);
  }
});
</script>
