<script setup lang="ts">
import { ref, defineAsyncComponent, computed, onMounted, shallowRef, onBeforeUnmount } from "vue";
import { ElComponents } from "@/plugins/elementPlus";
import { FormComponentEnum, type FormProps } from "./type";

const props = withDefaults(defineProps<FormProps>(), {
  componentList: () => [],
  formRules: () => ({}),
  labelWidth: "auto",
  formLine: false,
  operSpan: () => ({ sm: 16, md: 8, lg: 6 }),
  collapseCount: 3 // 默认折叠时只显示1个组件
});

const emit = defineEmits(["on-validate-success", "on-validate-error", "on-reset"]);

const formModel = defineModel("formModel") as Record<string, any>;
const formRef = ref<InstanceType<typeof ElForm> | null>(null);

// 组件映射，将字符串名称映射到实际的组件
const componentMapping = shallowRef<Record<string, any>>({});
const initComponentMapping = () => {
  const initMap: Record<string, any> = {};
  ElComponents.forEach(component => {
    initMap[component.name] = component;
  });
  componentMapping.value = initMap;
};

// 解析组件名称为实际组件
function resolveComponent(componentName: string | ComponentName) {
  const componentNameStr = String(componentName);

  // 检查 componentMapping 中是否存在对应的组件
  if (componentMapping.value[componentNameStr]) {
    return componentMapping.value[componentNameStr];
  }

  // 如果组件未预先加载，则尝试动态加载
  const importComponent = async () => {
    try {
      const component = await import(`element-plus/lib/components/${componentNameStr}/index`);
      return component.default || component; // 确保返回的是组件本身
    } catch (error) {
      console.error(`Failed to load component ${componentNameStr}`, error);
      return null;
    }
  };

  return defineAsyncComponent(() => importComponent());
}

// 控制是否折叠的状态
const isCollapsed = ref(true); // 默认折叠

// 根据折叠状态计算出需要显示的组件列表
const visibleComponentList = computed(() => {
  if (isCollapsed.value && props.componentList.length > props.collapseCount) {
    return props.componentList.slice(0, props.collapseCount); // 如果折叠，则只显示指定数量的组件
  }
  return props.componentList; // 否则显示所有组件
});

// 切换折叠状态的方法
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 验证方法
const getValidate = () => {
  return new Promise<void>((resolve, reject) => {
    if (!formRef.value) {
      reject(new Error("Component not mounted or has been unmounted."));
      return;
    }
    formRef.value.validate((valid: boolean) => {
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

// 重置方法
const handleReset = () => {
  if (!formRef.value) return;
  formRef.value.resetFields();
  emit("on-reset", formModel.value);
};

initComponentMapping();

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
    :rules="formRules"
    :inline="formLine"
    :label-width="labelWidth"
  >
    <el-row :gutter="10">
      <!-- 动态显示组件 -->
      <el-col
        v-for="(item, index) in visibleComponentList"
        :key="index"
        :sm="item?.span?.sm"
        :md="item?.span?.md"
        :lg="item?.span?.lg"
      >
        <el-form-item :prop="item.prop" :label="item.label" :rules="item.rules">
          <template v-if="item.componentName === FormComponentEnum.CustomTemplate">
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

      <!-- 操作栏 -->
      <el-col :sm="operSpan?.sm || 16" :md="operSpan?.md || 8" :lg="operSpan?.lg || 6">
        <el-form-item class="filter-form__btns">
          <slot name="oper" />
          <el-button v-if="componentList.length > collapseCount" link @click="toggleCollapse">
            {{ isCollapsed ? "展开" : "折叠" }}
            <el-icon class="ml-[6px]"> <ArrowDown v-if="isCollapsed" /><ArrowUp v-else /> </el-icon>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

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
