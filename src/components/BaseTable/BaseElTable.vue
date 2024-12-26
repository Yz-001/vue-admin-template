<template>
  <ElTable
    v-loading="loading"
    header-cell-class-name="table-head"
    cell-class-name="table-cell"
    :data="tableData"
    border
    :show-overflow-tooltip="true"
    :height="height"
    :max-height="maxHeight"
    @selection-change="handleSelectionChange"
  >
    <ElTableColumn v-if="hasSelect" type="selection" width="55" />
    <ElTableColumn
      v-for="(headColumn, index) in tableHead"
      :key="index"
      :prop="headColumn.prop"
      :align="headColumn.align || 'left'"
      :width="headColumn.width || ''"
      :fixed="headColumn.isFixed ? headColumn.isFixed : false"
      :label="headColumn.label + (headColumn.hUnit ? '(' + headColumn.hUnit + ')' : '')"
      :class-name="headColumn.columnClass || ''"
    >
      <template #default="scope">
        <!-- 自定义layout -->
        <template v-if="headColumn.diySlot">
          <slot :name="headColumn.diySlot" v-bind="scope" />
        </template>
        <!-- 工具栏layout -->
        <template v-else-if="headColumn.isTool">
          <TableToolCell :toolList="headColumn.toolConfig" :rowData="scope.row" />
        </template>
        <!-- 基本layout -->
        <template v-else>
          {{ scope.row[headColumn.prop] }}
          <template v-if="headColumn.cUnit">{{ headColumn.cUnit }}</template>
        </template>
      </template>
    </ElTableColumn>
  </ElTable>
  <div style="float: right">
    <el-pagination
      v-if="isShowPage"
      class="mt-[21px]"
      background
      layout="prev, pager, next,sizes"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { Loading } from "@element-plus/icons-vue";
import type { TableHead, TableData } from "./interface";
import TableToolCell from "./TableToolCell.vue";
const props = withDefaults(
  defineProps<{
    tableHead: TableHead[]; //表头数据
    tableData: TableData[]; //表格数据
    height?: number | string; //表格高度
    maxHeight?: number | string; //表格最大高度
    hasSelect?: boolean; //是否可多选
    isShowPage?: boolean; //是否开启分页
    totalCount?: number;
    loading?: boolean;
  }>(),
  {
    height: "auto",
    maxHeight: "auto",
    hasSelect: false,
    isShowPage: false,
    loading: false
  }
);
const emits = defineEmits(["selectionChange", "sizeChange", "currentChange"]);

// 选择行变化回调
const handleSelectionChange = (val: TableData[]) => {
  emits("selectionChange", val);
};
const handleSizeChange = (e: number) => {
  emits("sizeChange", e);
};
const handleCurrentChange = (e: number) => {
  emits("currentChange", e);
};
</script>

<style lang="scss" scoped>
:deep(.table-head) {
  height: 32px;
  font-weight: normal !important;
  color: #3e3f63;
  background: #f6f8ff !important;
}

:deep(.table-cell) {
  height: 43px;
  padding: 0;
  white-space: nowrap;
  background: #fff;
}

:deep(.el-table thead th) {
  font-weight: 550 !important;
}

:deep(
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .el-pager li
  ) {
  background-color: unset !important;
}
</style>
