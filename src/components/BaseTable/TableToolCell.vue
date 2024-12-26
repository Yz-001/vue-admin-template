<template>
  <div class="flex">
    <div v-for="(item, index) in IconList" :key="index" v-permission="item.permission">
      <ElTooltip :content="item.tipTxt(rowData)" effect="dark" placement="bottom">
        <BIcon size="24" class="cursor-pointer mr16px" @click="item.clickFunc(rowData)">
          <BSvg :name="item.icon" />
        </BIcon>
      </ElTooltip>
    </div>

    <ElDropdown v-if="TextList.length">
      <BIcon size="24" class="cursor-pointer">
        <BSvg name="iconToolMore" />
      </BIcon>

      <template #dropdown>
        <ElDropdownMenu>
          <ElDropdownItem v-for="(item, index) in TextList" :key="index">{{ item.tipTxt(rowData) }}</ElDropdownItem>
        </ElDropdownMenu>
      </template>
    </ElDropdown>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TableToolItem, TableData } from "./interface";
const props = withDefaults(
  defineProps<{
    toolList: TableToolItem[]; //tool配置列表
    rowData: TableData; //当前表格行数据对象
    iconShowNum?: number; //显示为icon的数量
  }>(),
  {
    iconShowNum: 3 //默认显示icon数量
  }
);

const IconList = computed(() => {
  return props.toolList.slice(0, props.iconShowNum);
});
const TextList = computed(() => {
  return props.toolList.slice(props.iconShowNum);
});
</script>
