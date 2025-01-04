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
    <el-table class="app-table__content" :data="tableData" :border="tableBorder" @cell-click="handleCellClick">
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
import { ElMessage, ElTag, ElImage, ElIcon, ElButton } from "element-plus";
import { useDateFormat } from "@vueuse/core";
import { TableTypeEnum, DateFormatEnum, type TableColumn, type Pagination, type RemoteConfig } from "./type";
import { Refresh, Document } from "@element-plus/icons-vue";
import { maskText, copyText, downloadFile } from "@/utils/common";
import { messageError } from "@/utils/element-utils/notification-common";

const props = withDefaults(
  defineProps<{
    columns: TableColumn[];
    data?: any[];
    pagination?: Pagination;
    remoteConfig?: RemoteConfig;
    tableBorder?: Boolean;
  }>(),
  {
    pagination: {
      currentPage: 1,
      pageSize: 10,
      showPagination: true
    },
    remoteConfig: () => {},
    tableBorder: true
  }
);

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
      if (error?.message) messageError(error?.message);
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

function handleCellClick(row: any, column: any, cell: HTMLElement, event: Event) {
  if (column.property == "template") return;
  const text = cell.innerText.trim();
  if (text) {
    copyText(text);
  }
}

function getFileUrls(row: any, column: TableColumn): string[] {
  const fileUrls = row[column.prop];
  return Array.isArray(fileUrls) ? fileUrls : [fileUrls];
}

function isImageUrl(url: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];
  const extensionMatch = url.match(/\.([^.]+)$/i);
  return extensionMatch && imageExtensions.includes(extensionMatch[1].toLowerCase());
}

function handleFileClick(fileUrl: string, column: TableColumn) {
  downloadFile(fileUrl);
}

function formatNumber(value: number, decimalPlaces: number = 2): string {
  return value.toFixed(decimalPlaces);
}

function getTagType(column: TableColumn, row: any): string {
  if (column.tagSuccess && row[column.prop] === column.tagSuccess.value) return "success";
  if (column.tagError && row[column.prop] === column.tagError.value) return "danger";
  return column.tagType || "info";
}

function getTagColor(column: TableColumn, row: any): string {
  if (column.tagSuccess && row[column.prop] === column.tagSuccess.value) return column.tagSuccess.color || undefined;
  if (column.tagError && row[column.prop] === column.tagError.value) return column.tagError.color || undefined;
  return undefined;
}
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

  .el-tag {
    color: var(--el-text-color-regular);
  }
}
</style>
