<script setup lang="ts">
import type { Component } from "vue";
import { computed, getCurrentInstance, nextTick, ref, useAttrs, watch } from "vue";
defineOptions({
  name: "BaseSvgIcon"
});

const modules = import.meta.glob("@/assets/svg/*.svg", { eager: true, as: "component" });
const props = withDefaults(defineProps<{ name: string; width?: string; height?: string; fill?: string }>(), {
  //采用缩写 避免和svg标签attrs原生属性重名
  width: "18px",
  height: "18px"
});
const attrs = useAttrs();
const instance = getCurrentInstance();
const svgRef = ref();
const currentComponent = computed<Component | undefined>(() => {
  const fileName = "/" + props.name + ".svg";
  for (const path in modules) {
    const mod = modules[path];
    if (path.endsWith(fileName)) {
      return mod as Component;
    }
  }
  console.log("not found svg file:" + fileName);
  return undefined;
});
let scopeId = "";
if (instance?.type) {
  // __scopeId 存在的条件是 <style scoped>
  const __scopeId = (instance?.type as { __scopeId?: string })?.__scopeId;
  if (__scopeId) {
    scopeId = __scopeId;
  }
}
const attachAttr = async () => {
  await nextTick();
  // 取到 svg dom
  const cpt = svgRef.value;
  if (!cpt) return;
  const svg = cpt.$el as Element | undefined;
  if (!(svg instanceof Element)) return;
  // 由于svg不在vue_template里,所以初始没有添加样式隔离,需要手动给svg和所有子dom添加 data-v-hash
  if (scopeId) {
    svg.setAttribute(scopeId, "");
    svg.querySelectorAll("*").forEach(element => {
      element.setAttribute(scopeId, "");
    });
  }
};
watch(
  () => props.name,
  async () => {
    await nextTick();
    attachAttr();
  },
  {
    immediate: true
  }
);
</script>

<template>
  <component
    :is="currentComponent"
    v-if="currentComponent"
    ref="svgRef"
    v-bind="$attrs"
    :class="['svg-raw', props.name ? `svg-${props.name}` : '']"
    :name="name"
  />
</template>

<style lang="scss" scoped>
svg,
path {
  transition: fill 250ms;
}

.svg-raw {
  width: v-bind("props.width");
  height: v-bind("props.height");

  path {
    fill: v-bind("props.fill");
  }
}
</style>
