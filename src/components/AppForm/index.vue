<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import { FormComponentEnum, type FormProps } from "./type";
import useForm from "./use-form";

const props = withDefaults(defineProps<FormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto",
  formLine: false,
  operColLayout: () => ({ sm: 16, md: 8, lg: 6 }),
  collapseCount: 3
});

const emit = defineEmits(["on-validate-success", "on-validate-error", "on-reset"]);
const formModel = defineModel("formModel") as Record<string, any>;

// 使用 useForm hook 并传入 props 和 emit
const {
  formRef,
  componentMapping,
  initComponentMapping,
  resolveComponent,
  isCollapsed,
  visibleComponentList,
  toggleCollapse,
  getValidate
} = useForm(props, emit);

initComponentMapping();

// 重置方法
const handleReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  emit("on-reset", formModel.value);
};

defineExpose({
  formRef,
  getValidate,
  handleReset
});
</script>

<template>
  <el-form
    ref="formRef"
    class="app-form"
    :model="formModel"
    :rules="props.formRules"
    :inline="props.formLine"
    :label-width="props.labelWidth"
  >
    <el-row :gutter="10">
      <!-- 动态显示组件 -->
      <el-col v-for="(item, index) in visibleComponentList" :key="index" v-bind="item?.colLayout || {}">
        <el-form-item :prop="item.prop" :label="item.label" :rules="item.rules">
          <template v-if="item.componentName === FormComponentEnum.CustomTemplate">
            <slot :name="`${item.prop}Slot`" />
          </template>
          <template v-else-if="item.componentName === FormComponentEnum.ElSelect">
            <el-select v-model="formModel[item.prop]" v-bind="item.attrs || {}">
              <el-option
                v-for="option in item.attrs?.options"
                :key="option[item.attrs?.key || item.attrs?.value || 'value']"
                :value="option[item.attrs?.value || 'value']"
                :label="option[item.attrs?.label || 'label']"
              />
            </el-select>
          </template>
          <template v-else-if="item.componentName === FormComponentEnum.ElRadio">
            <el-radio-group v-model="formModel[item.prop]" v-bind="item.attrs || {}">
              <el-radio
                v-for="option in item.attrs?.options"
                :key="option[item.attrs?.key || item.attrs?.value || 'value']"
                :value="option[item.attrs?.value || 'value']"
                :label="option[item.attrs?.label || 'label']"
              />
            </el-radio-group>
          </template>
          <template v-else-if="item.componentName === FormComponentEnum.ElRadioGroup">
            <el-radio-group v-model="formModel[item.prop]" v-bind="item.attrs || {}">
              <el-radio-button
                v-for="option in item.attrs?.options"
                :key="option[item.attrs?.key || item.attrs?.value || 'value']"
                :value="option[item.attrs?.value || 'value']"
                :label="option[item.attrs?.label || 'label']"
              />
            </el-radio-group>
          </template>
          <template v-else>
            <component
              :is="resolveComponent(item.componentName)"
              v-model="formModel[item.prop]"
              v-bind="item.attrs || {}"
              v-on="item.events || {}"
            >
              <template v-if="item.defalutSlot" #default="scope">
                <slot :name="`${item.prop}Content`" :row="scope.row" />
              </template>
            </component>
          </template>
        </el-form-item>
      </el-col>

      <!-- 操作栏 -->
      <el-col v-bind="props.operColLayout" class="app-form__btns">
        <el-form-item>
          <slot name="oper" />
          <el-button
            v-if="props.formLine && props.componentList.length > props.collapseCount"
            link
            @click="toggleCollapse"
          >
            {{ isCollapsed ? "展开" : "折叠" }}
            <el-icon class="ml-[6px]">
              <ArrowDown v-if="isCollapsed" />
              <ArrowUp v-else />
            </el-icon>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.app-form {
  &__btns {
    margin-left: auto !important;

    .el-form-item {
      text-align: right;

      :deep(.el-form-item__content) {
        justify-content: flex-end;
      }
    }
  }

  .el-form-item {
    width: 100%;
  }

  :deep(.el-form-item__label-wrap) {
    margin-left: 0 !important;
  }
}
</style>
