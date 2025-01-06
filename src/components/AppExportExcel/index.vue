<script setup lang="ts">
import { PropType, ref, withDefaults } from "vue";
import useExportExcel from "./use-export-excel";
import { type ExportExcelProps, ExportModeEnum } from "./type";
import { getExportApi } from "@/apis/common";

const props = withDefaults(defineProps<ExportExcelProps>(), {
  filename: "导出文件",
  buttonLabel: "导出",
  exportModel: ExportModeEnum.APILISTDATA,
  remoteConfig: {
    remoteApi: getExportApi,
    defaultParams: {}
  }
});
const { handleExport, getFormatExportData, applyStyles } = useExportExcel(props);
</script>

<template>
  <el-button class="app-export-button" type="success" @click="handleExport">{{ buttonLabel }}</el-button>
</template>

<style scoped lang="scss">
// .app-export-button {}
</style>
