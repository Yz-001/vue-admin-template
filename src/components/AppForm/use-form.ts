import { ref, computed, shallowRef } from "vue";
import { ElComponents } from "@/plugins/elementPlus";
import type { ElForm } from "element-plus";
import type { FormComponentEnum } from "./type";

export default function useForm(props, emit) {
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
  function resolveComponent(componentName: FormComponentEnum) {
    const componentNameStr = String(componentName);
    return componentMapping.value[componentNameStr];
  }

  // 控制是否折叠的状态
  const isCollapsed = ref(true); // 默认折叠

  // 根据折叠状态计算出需要显示的组件列表
  const visibleComponentList = computed(() => {
    if (props?.formLine && isCollapsed.value && props.componentList.length > props.collapseCount) {
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
      formRef.value.validate((valid: any) => {
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

  return {
    formRef,
    componentMapping,
    initComponentMapping,
    resolveComponent,
    isCollapsed,
    visibleComponentList,
    toggleCollapse,
    getValidate
  };
}
