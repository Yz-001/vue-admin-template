<!-- 适配 -->
<template>
  <div class="warpBox" :style="boxStyles">
    <div class="scale-box" :style="style">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

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
    // ...this.styles,
    transform: `scale(${scale.value}) translate(-50%, -50%)`,
    WebkitTransform: `scale(${scale.value}) translate(-50%, -50%)`,
    width: `${props.width}px`,
    height: `${props.height}px`
  };
});

onMounted(() => {
  window.addEventListener("resize", setScale, false);
});

const setScale = () => {
  let nowscale = getScale();
  scale.value = nowscale;
};
</script>

<style scoped>
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
