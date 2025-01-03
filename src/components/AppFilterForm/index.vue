<template>
  <AppForm
    ref="appFormRef"
    :formModel="formModel"
    :formRules="formRules"
    :componentList="componentList"
    :labelWidth="labelWidth"
  >
    <template #oper>
      <slot name="operBtnBefore" />
      <el-button type="primary" plain @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
      <!-- <el-button type="info" plain @click="handleRefresh">刷新</el-button> -->
      <slot name="operBtnAfter" />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppForm from "@/components/AppForm/index.vue";
import type { FilterFormProps } from "./type";
import { deepCopy } from "@/utils/common";

const props = withDefaults(defineProps<FilterFormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto"
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
