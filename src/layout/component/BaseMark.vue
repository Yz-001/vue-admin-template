<template>
  <div
    :class="{
      'layout-mark': true,
      'layout-mark--collapse': collapse,
      'layout-mark--expand': !collapse,
      'layout-mark--noClick': !isCanClick
    }"
    :collapse="collapse"
    @click="handleMarkClick"
  >
    <span class="layout-mark__icon"><svg-icon name="mark" /></span>
    <span class="layout-mark__title">{{ packageJson?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import packageJson from "../../../package.json";
const props = withDefaults(defineProps<{ collapse?: boolean; isCanClick?: boolean }>(), {
  isCanClick: true
});
const router = useRouter();
const handleMarkClick = () => {
  if (props.isCanClick) {
    router.push("/");
  }
};
</script>

<style lang="scss" scoped>
.layout-mark {
  width: auto;
  height: 50px;
  padding: 2px 10px 2px 16px;
  line-height: 46px;
  white-space: nowrap;
  cursor: pointer;

  &__icon {
    display: inline-block;
    width: 22px;
    height: 22px;
    text-align: center;

    .svg-mark {
      position: relative;
      top: 4px;
      width: 22px !important;
      height: 22px !important;
      fill: var(--el-color-primary) !important;
    }
  }

  &__title {
    margin-left: 4px;
    overflow: hidden;
    font-weight: bold;
    color: var(--el-text-color-primary);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &--collapse {
    width: 56px;
    padding: 0;
    overflow: hidden;

    .layout-mark__icon {
      width: 56px;
      height: 50px;

      .svg-mark {
        width: 60% !important;
        height: 60% !important;
        margin: 6px auto;
      }
    }
  }

  &--noClick {
    cursor: auto;
  }
}
</style>
