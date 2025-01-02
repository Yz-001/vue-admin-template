<template>
  <el-form
    ref="formRef"
    class="filter-form"
    :model="formModel"
    :rules="formRules"
    :label-width="labelWidth"
    :inline="true"
  >
    <el-row :gutter="10">
      <el-col
        v-for="(item, index) in componentList"
        :key="index"
        :sm="item.span.sm"
        :md="item.span.md"
        :lg="item.span.lg"
      >
        <el-form-item :prop="item.prop" :label="item.label" :rules="item.rules">
          <template v-if="item.componentName == 'CustomTemplate'">
            <slot :name="`${item.prop}`" />
          </template>
          <template v-else>
            <component
              :is="resolveComponent(item.componentName)"
              v-model="formModel[item.prop]"
              v-bind="item.attrs || {}"
              v-on="item.events || {}"
            >
              <template v-if="item.slots && item.slots.default">
                <span>{{ item.slots.default }}</span>
              </template>
            </component>
          </template>
        </el-form-item>
      </el-col>
      <el-col :sm="operSpan?.sm || 16" :md="operSpan?.md || 8" :lg="operSpan?.lg || 6">
        <el-form-item class="filter-form__btns">
          <slot name="operBtnBefore" />
          <el-button type="primary" plain @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="info" plain @click="handleRefresh">刷新</el-button>
          <slot name="operBtnAfter" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { ElComponents } from "@/plugins/elementPlus";
import type { FilterFormProps, ComponentItem } from "./index.d";
const prop = withDefaults(defineProps<FilterFormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto"
});
const emit = defineEmits(["on-search", "on-refresh", "on-reset", "on-validate-error"]);
const formModel = defineModel("formModel") as Record<string, any>;
const formRef = ref(null);

// 组件映射，将字符串名称映射到实际的组件
const componentMapping = shallowRef({});
const initComponentMapping = () => {
  const initMap = {};
  ElComponents.forEach(component => {
    initMap[component.name] = component;
  });
  componentMapping.value = initMap;
};

// 解析组件名称为实际组件
function resolveComponent(componentName: string) {
  return componentName in componentMapping
    ? defineAsyncComponent(() => componentMapping.value[componentName])
    : componentName;
}

const handleSearch = () => {
  formRef.value.validate(valid => {
    if (valid) {
      emit("on-search", formModel.value);
    } else {
      emit("on-validate-error", valid);
    }
  });
};
const handleRefresh = () => {
  formRef.value.resetFields();
  emit("on-refresh", formModel.value);
};
const handleReset = () => {
  formRef.value.resetFields();
  emit("on-reset", formModel.value);
};
onMounted(() => {
  initComponentMapping();
});
</script>

<style lang="scss" scoped>
.filter-form {
  &__btns {
    margin-left: 10px;
  }

  .el-form-item {
    width: 100%;
  }

  :deep(.el-form-item__label-wrap) {
    margin-left: 0 !important;
  }
}
</style>
