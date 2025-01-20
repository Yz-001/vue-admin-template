<template>
  <div class="page-container notif-list">
    <AppFilterForm
      v-model:formModel="searchForm"
      :elemColumns="elemColumns"
      @onSearch="handleSearch"
      @onReset="handleSearch"
    />

    <AppTable
      ref="appTableRef"
      class="notif-list__table"
      :elemColumns="tableColumns"
      :tableConfig="tableConfig"
      :remoteConfig="remoteConfig"
      :filterParams="filterParams"
      :exportExcelConfig="exportExcelConfig"
      @update:data="handleUpdateData"
    >
      <template #leftOper>
        <el-button type="primary" class="ml-auto" @click="handleAdd">新增通知</el-button>
      </template>
      <template #template="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </AppTable>

    <AppNotifFromDlg
      v-if="notifFromDlgProp.visible"
      v-model:visible="notifFromDlgProp.visible"
      :row="notifFromDlgProp.row"
    />
  </div>
</template>

<script setup lang="ts">
import AppNotifFromDlg from "@/views/notif/component/AppNotifFromDlg.vue";
import { getNotifListApi } from "@/apis/modules/notif";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, nextTick, computed } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { NotifRow } from "@/apis/interface/notif";
import { $t } from "@/plugins/i18n";

const searchForm = reactive({
  title: "",
  dateRange: []
});
const selectList = ref([]);
const handleSelectionChange = (newSelList: any) => {
  selectList.value = newSelList;
};
const tableConfig = reactive({
  border: true,
  selectionChange: handleSelectionChange
});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: $t("notice.title"),
    prop: "title",
    labelWidth: 60,
    colLayout: {
      sm: 12,
      md: 6,
      lg: 5
    },
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElDatePicker,
    label: $t("notice.dateRange"),
    prop: "dateRange",
    colLayout: {
      sm: 12,
      md: 8,
      lg: 6
    },
    attrs: {
      type: "datetimerange",
      rangeSeparator: $t("common.to"), // Assuming a translation for "至"
      startPlaceholder: $t("common.pleaseEnterStartDate"),
      endPlaceholder: $t("common.pleaseEnterEndDate"),
      placeholder: $t("common.pleaseEnter")
    }
  }
];

// 表格列配置
const tableColumns = [
  { label: "", prop: "index", colType: "selection" },
  {
    label: $t("notice.title"),
    prop: "title"
  },
  {
    label: $t("notice.content"),
    prop: "content"
  },
  {
    label: $t("common.updatedBy"),
    prop: "updatedInfo",
    sunValue: "name",
    type: TableTypeEnum.OBJECT
  },
  {
    label: $t("notice.publishStatus"),
    prop: "status",
    type: TableTypeEnum.SECTION,
    selectList: [
      { value: 1, name: "已发布" },
      { value: 2, name: "未发布" }
    ]
  },
  {
    label: $t("notice.dateRange"),
    prop: "dateRange",
    type: TableTypeEnum.DATE,
    dateStartProp: "dateRangeStart",
    dateEndProp: "dateRangeEnd",
    width: 320
  },
  {
    label: $t("common.createDate"),
    prop: "createDate",
    type: TableTypeEnum.DATE
  },
  {
    label: $t("notice.showUsers"),
    prop: "showUsers",
    type: TableTypeEnum.LIST
  },
  {
    label: $t("common.operation"),
    prop: "template",
    type: TableTypeEnum.TEMPLATE
  }
];

// 远程配置
const remoteConfig = {
  remoteApi: getNotifListApi,
  defaultParams: {},
  autoRequest: true
};
const appTableRef = ref<{ refresh: () => void } | null>(null);
const filterParams = ref({});
const handleSearch = (data: { [key: string]: any }) => {
  filterParams.value = data;
  nextTick(() => {
    if (appTableRef.value) appTableRef.value.refresh();
  });
};
const tableData = ref([]);
const handleUpdateData = (data: any[]) => {
  tableData.value = JSON.parse(JSON.stringify(data || []));
};
const notifFromDlgProp = reactive<{ visible: boolean; row: any }>({
  visible: false,
  row: undefined
});
const handleAdd = () => {
  notifFromDlgProp.visible = true;
};
const handleEdit = (row: NotifRow) => {
  notifFromDlgProp.visible = true;
  notifFromDlgProp.row = row;
};

const handleDelete = (row: NotifRow) => {
  console.log("删除:", row);
  // 删除逻辑...
};

const exportExcelConfig = computed(() => {
  const config = {
    filename: `通知列表${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => !["template", "index"].includes(i.prop)) || [],
    remoteConfig: {
      remoteApi: getNotifListApi,
      defaultParams: filterParams.value
    },
    buttonLabel: "导出表格"
  };
  return config;
});
</script>

<style lang="scss" scoped>
.notif-list {
  display: flex;
  flex-direction: column;
  padding: 20px;

  &__table {
    flex-grow: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
