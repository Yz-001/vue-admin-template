<template>
  <AppForm
    ref="appFormRef"
    :formModel="formModel"
    :formRules="formRules"
    :componentList="componentList"
    :labelWidth="labelWidth"
    :formLine="formLine"
    :collapseCount="collapseCount"
  >
    <template #oper>
      <slot name="operBtnBefore" />
      <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
      <el-button plain @click="handleReset">重置</el-button>
      <!-- <el-button plain @click="handleRefresh">刷新</el-button> -->
      <slot name="operBtnAfter" />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppForm from "@/components/AppForm/index.vue";
import type { FilterFormProps } from "./type";
import { deepCopy } from "@/utils/common";
import { Search } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FilterFormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto",
  formLine: true,
  operSpan: () => ({ sm: 16, md: 8, lg: 6 }),
  collapseCount: 3
});
const emit = defineEmits(["on-search", "on-refresh", "on-reset", "on-search-valid-error"]);
const formModel = defineModel("formModel") as Record<string, any>;
const appFormRef = ref(null);
const handleSearch = async () => {
  try {
    await appFormRef.value.getValidate();
    emit("on-search", formModel.value);
  } catch (error) {
    emit("on-search-valid-error", error);
  }
};
const handleRefresh = () => {
  appFormRef.value.handleReset();
  emit("on-refresh", deepCopy(formModel.value));
};
const handleReset = () => {
  appFormRef.value.handleReset();
  emit("on-reset", deepCopy(formModel.value));
};
</script>

<style lang="scss" scoped>
// .filter-form {
// }
</style>
