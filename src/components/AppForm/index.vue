<template>
  <el-form
    ref="formRef"
    class="app-form"
    :model="formModel"
    :rules="formRules"
    :inline="formLine"
    :label-width="labelWidth"
  >
    <el-row :gutter="10">
      <el-col
        v-for="(item, index) in componentList"
        :key="index"
        :sm="item?.span?.sm"
        :md="item?.span?.md"
        :lg="item?.span?.lg"
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
          <slot name="oper" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import { ElComponents } from "@/plugins/elementPlus";
import { type FormProps } from "./type";
const props = withDefaults(defineProps<FormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto",
  formLine: false
  // operSpan: {
  //   [SpanEnum.sm]: 16,
  //   [SpanEnum.md]: 8,
  //   [SpanEnum.lg]: 6
  // }
});
const emit = defineEmits(["on-validate-success", "on-validate-error", "on-reset"]);
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

const getValidate = () => {
  return new Promise<void>((resolve, reject) => {
    formRef.value.validate(valid => {
      if (valid) {
        resolve(valid);
        emit("on-validate-success", valid);
      } else {
        reject(valid);
        emit("on-validate-error", valid);
      }
    });
  });
};
const handleReset = () => {
  formRef.value.resetFields();
  emit("on-reset", formModel.value);
};
defineExpose({
  formRef,
  getValidate,
  handleReset
});
onMounted(() => {
  initComponentMapping();
});
</script>

<style lang="scss" scoped>
.app-form {
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
