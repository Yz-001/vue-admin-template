<template>
  <AppForm
    ref="appFormRef"
    v-bind="$attrs"
    v-model:formModel="formModel"
    :formRules="formRules"
    :elemColumns="elemColumns"
    :labelWidth="labelWidth"
    :formLine="formLine"
    :collapseCount="collapseCount"
  >
    <template v-for="{ name } in renderSlots()" :key="name">
      <slot :name="name" />
    </template>

    <template #oper>
      <slot name="operBtnBefore" />
      <el-button type="primary" :icon="Search" @click="handleSearch">{{ $t("operate.query") }}</el-button>
      <el-button plain @click="handleReset">{{ $t("operate.reset") }}</el-button>
      <!-- <el-button plain @click="handleRefresh">刷新</el-button> -->
      <slot name="operBtnAfter" />
    </template>
  </AppForm>
</template>

<script setup lang="ts">
import { useSlots, ref } from "vue";
import AppForm from "@/components/AppForm/index.vue";
import type { FilterFormProps } from "./type";
import { Search } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FilterFormProps>(), {
  elemColumns: () => [],
  formRules: () => ({}),
  labelWidth: "auto",
  formLine: true,
  operSpan: () => ({ sm: 16, md: 8, lg: 6 }),
  collapseCount: 3
});
const emit = defineEmits(["on-search", "on-refresh", "on-reset", "on-search-valid-error"]);
const formModel = defineModel("formModel") as Record<string, any>;
const appFormRef = ref<any>(null);

const handleSearch = async () => {
  try {
    await appFormRef.value.getValidate();
    emit("on-search", JSON.parse(JSON.stringify(formModel.value)));
  } catch (error) {
    emit("on-search-valid-error", error);
  }
};
// const handleRefresh = () => {
//   appFormRef.value.handleReset();
//   emit("on-refresh", JSON.parse(JSON.stringify(formModel.value)));
// };
const handleReset = () => {
  appFormRef.value.handleReset();
  emit("on-reset", JSON.parse(JSON.stringify(formModel.value)));
};
const slots: any = useSlots();
const renderSlots = () => {
  return Object.entries(slots).map(([name, slot]) => ({
    name: name as keyof typeof slots,
    slot
  }));
};
</script>

<style lang="scss" scoped>
// .filter-form {
// }
</style>
