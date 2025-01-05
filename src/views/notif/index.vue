<template>
  <div class="page-container notif-list">
    <AppFilterForm
      v-model:formModel="searchForm"
      :componentList="componentList"
      @onSearch="handleSearch"
      @onReset="handleSearch"
    />

    <AppTable
      ref="appTableRef"
      class="notif-list__table"
      :columns="tableColumns"
      :remoteConfig="remoteConfig"
      :filterParams="filterParams"
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
import type { NotifRow } from "@/apis/interface/notif";
import { TableTypeEnum, DateFormatEnum } from "@/components/AppTable/type";
import { FormComponentEnum } from "@/components/AppForm/type";

const searchForm = reactive({
  title: "",
  dateRange: []
});
const componentList = [
  {
    componentName: FormComponentEnum.ElInput,
    label: "标题",
    prop: "title",
    labelWidth: 60,
    span: {
      sm: 12,
      md: 6,
      lg: 5
    },
    attrs: {
      placeholder: "请输入标题"
    }
  },
  {
    componentName: FormComponentEnum.ElDatePicker,
    label: "通知时间",
    prop: "dateRange",
    span: {
      sm: 12,
      md: 8,
      lg: 6
    },
    attrs: {
      type: "datetimerange",
      rangeSeparator: "至",
      startPlaceholder: "开始日期",
      endPlaceholder: "结束日期",
      placeholder: "请输入标题"
    }
  }
];

// 表格列配置
const tableColumns = [
  { label: "标题", prop: "title" },
  { label: "内容", prop: "content" },
  { label: "更新人", prop: "updatedInfo", sunValue: "name", type: TableTypeEnum.OBJECT },
  {
    label: "发布状态",
    prop: "status",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: 1 },
    tagError: { value: 2 },
    selectList: [
      { value: 1, name: "已发布" },
      { value: 2, name: "未发布" }
    ]
  },
  {
    label: "通知时间",
    prop: "dateRange",
    type: TableTypeEnum.DATE,
    dateStartProp: "dateRangeStart",
    dateEndProp: "dateRangeEnd",
    width: 320
  },
  { label: "创建时间", prop: "createDate", type: TableTypeEnum.DATE },
  { label: "可见用户", prop: "showUsers", type: TableTypeEnum.LIST },
  { label: "操作", prop: "template", type: TableTypeEnum.TEMPLATE }
];

// 远程配置
const remoteConfig = {
  remoteApi: getNotifListApi,
  defaultParams: {},
  autoRequest: true
};
const appTableRef = ref(null);
const filterParams = ref({});
const handleSearch = (data: { [key: string]: any }) => {
  filterParams.value = data;
  nextTick(() => {
    if (appTableRef.value) appTableRef.value.refresh();
  });
};
const tableData = ref([]);
const handleUpdateData = (tableData: any[]) => {
  tableData.value = tableData || [];
};
const notifFromDlgProp = reactive({
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

// 手动请求
// :data="tableData"
// <!-- :pagination="pagination" -->
// const tableData = reactive([
// {
//   id: 1,
//   title: "Alice",
//   content: "本平台通知新用户",
//   updatedInfo: { id: 1, name: "超级管理员" },
//   createDate: new Date(),
//   status: 1,
//   showUsers: [{ name: "测试1" }, { name: "测试2" }],
//   dateRangeStart: new Date(),
//   dateRangeEnd: new Date()
// }
// ]);
// 分页配置
// const pagination = reactive({
//   currentPage: 1,
//   pageSize: 10,
//   total: tableData.length,
//   showPagination: true
// });
// const handleSearch = () => {
//   try {
//     const response = await getNotifListApi({
//       title: searchForm.title,
//       startDate: searchForm.dateRange?.[0],
//       endDate: searchForm.dateRange?.[1]
//     });
//     tableData.value = response.data;
//   } catch (error) {
//     console.error("Failed to fetch tableData:", error);
//   }
// };
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
