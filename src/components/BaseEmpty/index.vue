<script setup lang="ts">
import { computed } from "vue";

const prop = withDefaults(
  defineProps<{
    type?: string;
    width?: string;
    height?: string;
    top?: string;
    ImgSrcName?: string;
    tipTxt?: string;
    isload?: boolean;
  }>(),
  { type: "default", width: "", height: "", top: "", tipTxt: "", isload: false }
);

const getImgSrc = (name: string) => {
  if (name) {
    return new URL(`../assets/img/${name}`, import.meta.url).href;
  }
};

const setStyle = () => {
  const TYPE_MAP: EmptyType = {
    small: { img: "empty-small.png", width: "197px", height: "208px", top: "10%" },
    default: { img: "empty.png", width: "267px", height: "261px", top: "10%" },
    large: { img: "empty-large.png", width: "320px", height: "313px", top: "30%" },
    table: { img: "empty-table.png", width: "213px", height: "165px", top: "20%" }
  };
  return {
    background: `url(${prop?.ImgSrcName ? getImgSrc(prop.ImgSrcName) : getImgSrc(TYPE_MAP[prop.type].img)}) no-repeat`,
    backgroundSize: `100% 100%`,
    width: prop.width || TYPE_MAP[prop.type].width,
    height: prop.height || TYPE_MAP[prop.type].height,
    margin: `${prop.top || TYPE_MAP[prop.type].top} auto`
  };
};

const getTxt = computed(() => {
  return prop.isload ? "加载中..." : prop.tipTxt || "暂无数据";
});

interface EmptyType {
  [key: string]: EmptyInfo;
}

interface EmptyInfo {
  img: string;
  width: string;
  height: string;
  top: string;
}
</script>

<template>
  <div class="empty-img" :style="setStyle()">
    <p :type="type" class="empty-img__txt">{{ getTxt }}</p>
  </div>
</template>

<style lang="scss" scoped>
.empty-img {
  position: relative;
  margin: 10% auto;

  &__txt {
    position: absolute;
    bottom: -35px;
    width: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #999;
    text-align: center;
    background-clip: text;

    &[type="table"] {
      bottom: -65px !important;
      margin-top: 10px;
    }
  }
}
</style>
