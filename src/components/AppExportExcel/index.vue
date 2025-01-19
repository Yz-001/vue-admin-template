<script setup lang="ts">
import { withDefaults } from "vue";
import useExportExcel from "./useExportExcel";
import { type ExportExcelProps, ExportModeEnum } from "./type";
import { $t } from "@/plugins/i18n";

const props = withDefaults(defineProps<ExportExcelProps>(), {
  filename: $t("common.export"),
  buttonLabel: $t("common.export"),
  exportModel: ExportModeEnum.APILISTDATA
});
const { handleExport } = useExportExcel(props);
</script>

<template>
  <el-button class="app-export-button" type="success" @click="handleExport">{{ buttonLabel }}</el-button>
</template>

<style scoped lang="scss">
// .app-export-button {}
</style>
