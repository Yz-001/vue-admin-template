<template>
  <div class="app-table">
    <div class="app-table__oper">
      <div class="app-table__oper__left">
        <slot name="leftOper" />
      </div>
      <div class="app-table__oper__right">
        <slot name="rightOperBefore" />
        <el-button :icon="Refresh" circle @click="refresh" />
        <slot name="rightOperAfter" />
      </div>
    </div>
    <el-table class="app-table__content" :data="tableData" :border="tableBorder">
      <el-table-column
        v-for="column in tableColumns"
        :key="column.prop"
        :label="column.label"
        :prop="column.prop"
        :width="column.width"
      >
        <template #default="scope">
          <slot v-if="column.type === TableTypeEnum.TEMPLATE" :name="column.slotName || column.prop" :row="scope.row" />
          <span v-else-if="column.type === TableTypeEnum.OBJECT">{{ getObjectValue(scope.row, column) }}</span>
          <span v-else-if="column.type === TableTypeEnum.SECTION">{{ getSectionValue(scope.row, column) }}</span>
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
          <span v-else>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="app-table__pagination">
      <el-pagination
        v-if="pagination.showPagination"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="tableTotal"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";
import { useDateFormat } from "@vueuse/core";
import { TableTypeEnum, DateFormatEnum, type TableColumn, type Pagination, type RemoteConfig } from "./type";
import { Refresh } from "@element-plus/icons-vue";

const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    required: false
  },
  columns: {
    type: Array as PropType<TableColumn[]>,
    required: true
  },
  pagination: {
    type: Object as PropType<Pagination>,
    default: () => ({
      currentPage: 1,
      pageSize: 10,
      showPagination: true
    })
  },
  remoteConfig: {
    type: Object as PropType<RemoteConfig>,
    default: () => ({})
  },
  tableBorder: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(["update:pagination", "refresh", "update:data"]);

const tableData = ref(props.data);
const tableColumns = computed(() => props.columns);
const tableTotal = ref(undefined);

// 获取对象中指定值
function getObjectValue(row: any, column: TableColumn): string {
  const valueKey = column.sunValue || "name";
  return row[column.prop]?.[valueKey] || "";
}

function getSectionValue(row: any, column: TableColumn): string {
  if (!column.selectList) return "";
  const labelValue = column.labelValue || "value";
  const labelName = column.labelName || "name";
  const item = column.selectList.find(item => item[labelValue] === row[column.prop]);
  return item ? item[labelName] : "";
}

function getImageSrc(row: any, column: TableColumn): string {
  return row[column.prop] || "";
}

function handlePreviewImage(row: any, column: TableColumn) {
  // 图片预览逻辑可以在这里实现
}

function getListValues(row: any, column: TableColumn): string[] {
  const items = row[column.prop] || [];
  const valueKey = column.sunValue || "name";
  return items.map(item => item[valueKey]);
}

function formatDate(date: string | Date, formatStr: DateFormatEnum = DateFormatEnum.YYYY_MM_DD_HH_MM_SS): string {
  if (!date) return "";
  const formattedDate = useDateFormat(new Date(date), formatStr, { locales: "en-US" }).value;
  return formattedDate;
}

function formatDateRange(
  startDate: string | Date,
  endDate: string | Date,
  formatStr: DateFormatEnum = DateFormatEnum.YYYY_MM_DD_HH_MM_SS,
  separator: string = "-"
): string {
  const startFormatted = formatDate(startDate, formatStr);
  const endFormatted = formatDate(endDate, formatStr);
  return `${startFormatted} ${separator} ${endFormatted}`;
}

function handleSizeChange(newSize: number) {
  emit("update:pagination", { ...props.pagination, pageSize: newSize });
}

function handleCurrentChange(newPage: number) {
  emit("update:pagination", { ...props.pagination, currentPage: newPage });
}

function refresh(filterParams: { [key: string]: any } = {}) {
  fetchData(filterParams);
  emit("refresh");
}

async function fetchData(filterParams: { [key: string]: any } = {}) {
  if (props.remoteConfig.autoRequest && props.remoteConfig.remoteApi) {
    try {
      const params = {
        ...filterParams,
        ...props.remoteConfig.defaultParams,
        pageNumber: props.pagination.currentPage,
        pageSize: props.pagination.pageSize
      };
      const result = await props.remoteConfig.remoteApi(params);
      tableData.value = result.data?.rows || [];
      tableTotal.value = result.data?.total;
      emit("update:data", result); // 更新外部组件的数据
    } catch (error) {
      if (error?.message) ElMessage.error(error?.message);
    }
  }
}

function clearData() {
  tableData.value = [];
  tableTotal.value = 0;
  emit("update:data", []);
}

onMounted(() => {
  if (props.remoteConfig.autoRequest) {
    fetchData();
  }
});

watch(() => props.pagination, fetchData, { deep: true });

defineExpose({
  refresh,
  clearData
});
</script>

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
}
</style>
