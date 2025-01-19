<script setup lang="ts">
import { onMounted, defineExpose, computed, watch } from "vue";
import { ElTag, ElImage, ElIcon, ElButton } from "element-plus";
import { TableColTypeEnum, TableTypeEnum, type TableProps, type TableConfig, type TableColumn } from "./type";
import { Refresh, Document, ScaleToOriginal } from "@element-plus/icons-vue";
import useTable from "./useTable";
import AppExportExcel from "@/components/AppExportExcel/index.vue";
import { type ExportExcelProps } from "@/components/AppExportExcel/type";
import { $t } from "@/plugins/i18n";

const props = withDefaults(defineProps<TableProps>(), {
  defaultPageNumber: 1,
  defaultPageSize: 20,
  showPagination: true,
  showExportExcel: true
});
const emit = defineEmits(["update:currentPage", "update:pageSize", "refresh", "update:data", "cell-click"]);

const {
  tableData,
  tableColumns,
  tableTotal,
  pagination,
  selectColShowList,
  getObjectValue,
  getSectionValue,
  getImageSrc,
  handlePreviewImage,
  getListValues,
  formatDate,
  formatDateRange,
  handleSizeChange,
  handleCurrentChange,
  refresh,
  fetchData,
  clearData,
  handleCellClick,
  maskText,
  getFileUrls,
  isImageUrl,
  handleFileClick,
  formatNumber,
  getTagType,
  getTagColor
} = useTable(props, emit);

watch(
  () => props.data,
  (newList: any) => {
    tableData.value = newList;
  },
  {
    immediate: true,
    deep: true
  }
);
watch(
  () => props.tableTotal,
  (newNum: number | undefined) => {
    if (typeof newNum == "number") {
      tableTotal.value = newNum;
    }
  }
);
watch(
  () => props.elemColumns,
  (newList: TableColumn[]) => {
    selectColShowList.value =
      (props?.elemColumns || [])?.map(column => {
        return column.prop;
      }) || [];
  },
  {
    immediate: true,
    deep: true
  }
);

const safeTableConfig = computed<TableConfig>(() => {
  return props?.tableConfig ?? ({} as TableConfig);
});
const safeExportExcelConfig = computed<ExportExcelProps>(() => ({
  ...(props.exportExcelConfig ?? ({} as ExportExcelProps))
}));

onMounted(() => {
  if (props?.remoteConfig?.autoRequest) {
    fetchData();
  }
});

defineExpose({
  refresh,
  clearData,
  handleSizeChange,
  handleCurrentChange
});
</script>

<template>
  <div class="app-table">
    <div class="app-table__oper">
      <div class="app-table__oper__left">
        <slot name="leftOper" />
        <AppExportExcel v-if="showExportExcel" :buttonLabel="$t('common.exportTable')" v-bind="safeExportExcelConfig" />
      </div>
      <div class="app-table__oper__right">
        <slot name="rightOperBefore" />
        <el-button :icon="Refresh" circle @click="refresh" />
        <el-popover v-if="props?.elemColumns?.length" placement="right" width="100" trigger="click">
          <el-checkbox-group v-model="selectColShowList">
            <el-checkbox
              v-for="column in props.elemColumns"
              :key="column.prop"
              :label="column.label"
              :value="column.prop"
              class="w-full"
            />
          </el-checkbox-group>
          <template v-slot:reference>
            <el-button :icon="ScaleToOriginal" class="ml-[20px]" circle />
          </template>
        </el-popover>
        <slot name="rightOperAfter" />
      </div>
    </div>
    <el-table
      class="app-table__content"
      :data="tableData"
      border
      v-bind="safeTableConfig"
      @selectionChange="safeTableConfig?.selectionChange"
      @cell-click="handleCellClick"
    >
      <el-table-column
        v-for="column in tableColumns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
        :type="column?.colType || TableColTypeEnum.DEFAULT"
        :selectable="column?.selectableFn"
        :index="column?.indexFn"
      >
        <template #default="scope">
          <slot v-if="column.type === TableTypeEnum.TEMPLATE" :name="column.slotName || column.prop" :row="scope.row" />
          <span v-else-if="column.type === TableTypeEnum.OBJECT">{{ getObjectValue(scope.row, column) }}</span>
          <el-tag
            v-else-if="column.type === TableTypeEnum.SECTION"
            :type="getTagType(column, scope.row)"
            :color="getTagColor(column, scope.row)"
          >
            {{ getSectionValue(scope.row, column) }}
          </el-tag>
          <el-image
            v-else-if="column.type === TableTypeEnum.IMG"
            :src="getImageSrc(scope.row, column)"
            class="app-table__img"
            :preview-src-list="[getImageSrc(scope.row, column)]"
            :style="{ maxHeight: `${column.maxHeight}px` }"
            @click="handlePreviewImage(scope.row, column)"
          />
          <span v-else-if="column.type === TableTypeEnum.LIST">{{ getListValues(scope.row, column).join(", ") }}</span>
          <span v-else-if="column.type === TableTypeEnum.DATE">
            <template v-if="column.dateStartProp && column.dateEndProp">
              {{
                formatDateRange(
                  scope.row[column.dateStartProp],
                  scope.row[column.dateEndProp],
                  column.dateFormat,
                  column.separator
                )
              }}
            </template>
            <template v-else>
              {{ formatDate(scope.row[column.prop], column.dateFormat) }}
            </template>
          </span>
          <span v-else-if="column.type === TableTypeEnum.FILES">
            <a v-for="(fileUrl, index) in getFileUrls(scope.row, column)" :key="index" :href="fileUrl" target="_blank">
              <el-image
                v-if="isImageUrl(fileUrl)"
                :src="fileUrl"
                class="app-table__img mr-[5px]"
                :preview-src-list="[fileUrl]"
              />
              <el-icon v-else :size="20" class="mr-[5px]" @click="handleFileClick(fileUrl, column)">
                <Document />
              </el-icon>
            </a>
          </span>
          <span v-else-if="column.type === TableTypeEnum.NUMBER">
            {{ formatNumber(scope.row[column.prop], column.decimalPlaces) }}
          </span>
          <span v-else-if="column.masked">
            {{ maskText(scope.row[column.prop]) }}
          </span>
          <span v-else-if="!Object.hasOwn(column, 'colType') || column.colType == TableColTypeEnum.DEFAULT">
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-table__pagination">
      <el-pagination
        v-if="showPagination"
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500]"
        :total="tableTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  &__oper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__img {
    max-width: 100px;
    cursor: pointer;
  }

  &__content {
    flex-grow: 1;
  }

  &__pagination {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin-top: 20px;
  }

  &__operations {
    margin-top: 10px;
    text-align: right;
  }

  .el-tag {
    color: var(--el-text-color-regular);
  }
}
</style>
