<template>
  <div class="page-container dept-list">
    <AppFilterForm
      v-model:formModel="searchForm"
      :componentList="componentList"
      @onSearch="handleSearch"
      @onReset="handleSearch"
    >
      <template #status>
        <el-select v-model="searchForm.status">
          <el-option
            v-for="item in Object.values(DEPT_STATUS)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </template>
    </AppFilterForm>

    <AppTable
      ref="appTableRef"
      class="notif-list__table"
      :columns="tableColumns"
      :tableConfig="tableConfig"
      :remoteConfig="remoteConfig"
      :filterParams="filterParams"
      :exportExcelConfig="exportExcelConfig"
      @update:data="handleUpdateData"
    >
      <template #leftOper>
        <el-button type="primary" class="ml-auto" @click="handleAdd">新增</el-button>
      </template>
      <template #template="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </AppTable>
  </div>
</template>

<script setup lang="ts">
// import AppNotifFromDlg from "@/views/notif/component/AppNotifFromDlg.vue";
import { getDeptListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, nextTick, computed } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { DeptRow } from "@/apis/interface/system";
import { DEPT_STATUS } from "@/assets/constant/index";
const searchForm = reactive({
  deptName: "",
  status: undefined
});
const selectList = ref([]);
const handleSelectionChange = (newSelList: any) => {
  selectList.value = newSelList;
};
const tableConfig = reactive({
  border: true,
  selectionChange: handleSelectionChange
});
const componentList = [
  {
    componentName: FormComponentEnum.ElInput,
    label: "部门名称",
    prop: "deptName",
    labelWidth: 60,
    colLayout: {
      sm: 12,
      md: 6,
      lg: 5
    },
    attrs: {
      placeholder: "请输入部门名称"
    }
  },
  {
    componentName: FormComponentEnum.CustomTemplate,
    label: "部门状态",
    prop: "status",
    colLayout: {
      sm: 12,
      md: 8,
      lg: 6
    },
    attrs: {},
    defalutSlot: true
  }
];

// 表格列配置
const tableColumns = [
  { label: "部门名称", prop: "deptName" },
  { label: "排序", prop: "orderNum", type: TableTypeEnum.NUMBER },
  {
    label: "状态",
    prop: "status",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: DEPT_STATUS.NORMAL.value },
    tagError: { value: DEPT_STATUS.PAUSE.value },
    selectList: Object.values(DEPT_STATUS),
    labelName: "label"
  },
  { label: "创建时间", prop: "createTime", type: TableTypeEnum.DATE },
  { label: "操作", prop: "template", type: TableTypeEnum.TEMPLATE }
];

// 远程配置
const remoteConfig = {
  remoteApi: getDeptListApi,
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
const deptFromDlgProp = reactive<{ visible: boolean; row: any }>({
  visible: false,
  row: undefined
});
const handleAdd = () => {
  deptFromDlgProp.visible = true;
};
const handleEdit = (row: DeptRow) => {
  deptFromDlgProp.visible = true;
  deptFromDlgProp.row = row;
};

const handleDelete = (row: DeptRow) => {
  console.log("删除:", row);
  // 删除逻辑...
};

const exportExcelConfig = computed(() => {
  const config = {
    filename: `部门列表${new Date().getTime()}`,
    excelColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getDeptListApi,
      defaultParams: filterParams.value
    },
    buttonLabel: "导出表格"
  };
  return config;
});
</script>

<style lang="scss" scoped>
.dept-list {
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
