<script lang="ts" setup>
import { computed, withDefaults } from "vue";
interface cardProps {
  panelTitle?: string;
  panelHeight?: string;
  panelMargin?: string;
  empty?: boolean;
  isload?: boolean;
}

const props = withDefaults(defineProps<cardProps>(), {
  panelTitle: "",
  panelHeight: "100%",
  panelMargin: "",
  empty: false,
  isload: false
});

const panelStyle = computed(() => {
  return { height: props.panelHeight, margin: props.panelMargin };
});
</script>

<template>
  <div class="panel" v-bind="$attrs" :style="panelStyle">
    <div class="panel-container">
      <slot name="head">
        <div class="panel-heading">
          <div class="panel-heading__title" :show="!!panelTitle">
            {{ panelTitle }}
          </div>
          <div class="panel-heading__opera">
            <slot name="headopera" />
          </div>
        </div>
      </slot>
    </div>
    <div class="panel-body">
      <div v-if="$slots.header" class="panel-body__header">
        <slot name="header" />
      </div>
      <div class="panel-body__content">
        <slot v-if="!empty" />
        <BaseEmpty v-else :type="$attrs.emptyType || 'small-x'" :isload="isload" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$border-width: 0.125rem;

.panel {
  z-index: 1;
  width: 100%;
  overflow: hidden;
  font-size: 16px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 4px;

  &-container {
    padding: 10px;
  }

  &-heading {
    display: flex;
    justify-content: space-between;
    margin: 0;
    color: $--text-color-base;
    letter-spacing: 0.023rem;

    &__title[show="true"] {
      font-size: 16px;
      line-height: 25px;

      &::before {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 5px;
        content: "";
        background-color: var(--el-color-primary);
      }
    }

    &__opera {
      width: calc(100% - 120px);
      font-size: 14px;
      line-height: 20px;
      color: #666;
      text-align: right;
    }
  }

  &-body {
    display: flex;
    flex-basis: 100%;
    flex-direction: column;
    padding: 0 10px;

    &__header {
      padding-right: 0.25rem;
      padding-left: 0.25rem;
    }

    &__content {
      display: flex;
      flex-basis: 100%;
      flex-direction: column;
    }
  }
}
</style>
