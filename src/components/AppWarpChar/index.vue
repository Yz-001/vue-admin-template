<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = withDefaults(defineProps<{ boxStyles: any; width: number; height: number }>(), {
  boxStyles: {
    background: "#050d32"
  },
  width: 1280,
  height: 1080
});
const getScale = () => {
  let ww = window.innerWidth / props.width;
  let wh = window.innerHeight / props.height;
  return ww < wh ? ww : wh;
};

const scale = ref(getScale());
const style = computed(() => {
  return {
    transform: `scale(${scale.value}) translate(-50%, -50%)`,
    WebkitTransform: `scale(${scale.value}) translate(-50%, -50%)`,
    width: `${props.width}px`,
    height: `${props.height}px`
  };
});

const setScale = () => {
  const nowscale = getScale();
  scale.value = nowscale;
};

onMounted(() => {
  window.addEventListener("resize", setScale, false);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setScale, false);
});
</script>

<template>
  <div class="warpBox" :style="boxStyles">
    <div class="scale-box" :style="style">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scale-box {
  position: absolute;
  top: 50%;
  left: 50%;
  transition: 0.3s;
  transform-origin: 0 0;
}

.warpBox {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
