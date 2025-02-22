<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import { FormComponentEnum, type FormProps } from "./type";
import useForm from "./useForm";

const props = withDefaults(defineProps<FormProps>(), {
  elemColumns: () => [],
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
          <template v-if="item.type === FormComponentEnum.CustomTemplate">
            <slot :name="`${item.prop}Slot`" />
          </template>
          <template v-else-if="item.type === FormComponentEnum.ElSelect">
            <el-select v-model="formModel[item.prop]" v-bind="item.attrs || {}" v-on="item?.events || {}">
              <el-option
                v-for="option in item?.options"
                :key="option[item.optionAttrs?.key || item.optionAttrs?.value || 'value']"
                :value="option[item.optionAttrs?.value || 'value']"
                :label="option[item.optionAttrs?.label || 'label']"
                v-bind="item?.attrs?.optionAttrs || {}"
                v-on="item?.attrs?.optionEvents || {}"
              />
            </el-select>
          </template>
          <template v-else-if="item.type === FormComponentEnum.ElRadio">
            <el-radio-group v-model="formModel[item.prop]" v-bind="item.attrs || {}" v-on="item?.events || {}">
              <el-radio
                v-for="option in item?.options"
                :key="option[item.optionAttrs?.key || item.optionAttrs?.value || 'value']"
                :value="option[item.optionAttrs?.value || 'value']"
                :label="option[item.optionAttrs?.label || 'label']"
                v-bind="item?.optionAttrs || {}"
                v-on="item?.optionEvents || {}"
              />
            </el-radio-group>
          </template>
          <template v-else-if="item.type === FormComponentEnum.ElRadioGroup">
            <el-radio-group v-model="formModel[item.prop]" v-bind="item.attrs || {}" v-on="item?.events || {}">
              <el-radio-button
                v-for="option in item?.options"
                :key="option[item.optionAttrs?.key || item.optionAttrs?.value || 'value']"
                :value="option[item.optionAttrs?.value || 'value']"
                :label="option[item.optionAttrs?.label || 'label']"
                v-bind="item?.optionAttrs || {}"
                v-on="item?.optionEvents || {}"
              />
            </el-radio-group>
          </template>
          <template v-else-if="item.type === FormComponentEnum.ElCheckboxGroup">
            <el-checkbox-group v-model="formModel[item.prop]" v-bind="item.attrs || {}" v-on="item?.events || {}">
              <el-checkbox
                v-for="option in item?.options"
                :key="option[item.optionAttrs?.key || item.optionAttrs?.value || 'value']"
                :value="option[item.optionAttrs?.value || 'value']"
                :label="option[item.optionAttrs?.label || 'label']"
                v-bind="item?.optionAttrs || {}"
                v-on="item?.optionEvents || {}"
              />
            </el-checkbox-group>
          </template>
          <template v-else>
            <component
              :is="resolveComponent(item.type)"
              v-model="formModel[item.prop]"
              v-bind="item.attrs || {}"
              v-on="item.events || {}"
            >
              <template v-if="item.defalutSlot" #default="scope">
                <slot :name="`${item.prop}Slot`" :row="scope.row" />
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
            v-if="props.formLine && props.elemColumns.length > props.collapseCount"
            link
            @click="toggleCollapse"
          >
            {{ isCollapsed ? $t("common.expand") : $t("common.collapse") }}
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
