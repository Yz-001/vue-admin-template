<template>
  <div class="page-container dept-list">
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
      :data="tableData"
      :tableTotal="tableTotal"
      :filterParams="filterParams"
      :exportExcelConfig="exportExcelConfig"
    >
      <template #leftOper>
        <el-button type="primary" class="ml-auto" @click="handleAdd">新增</el-button>
      </template>
      <template #template="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </AppTable>

    <AppDeptFromDlg
      v-if="baseFromDlgProp.visible"
      v-model:visible="baseFromDlgProp.visible"
      :row="baseFromDlgProp.row"
    />
  </div>
</template>

<script setup lang="ts">
import AppDeptFromDlg from "@/views/system/dept/component/AppDeptFromDlg.vue";
import { getDeptListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, nextTick, computed, onMounted } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { DeptListSearch, DeptRow } from "@/apis/interface/system";
import { DEPT_STATUS } from "@/assets/constant/index";
import { messageError } from "@/utils/element-utils/notification-common";
import { ElSelect } from "element-plus";
import { COL_XL } from "@/assets/constant/form";

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
  rowKey: "id",
  defaultExpandAll: true,
  selectionChange: handleSelectionChange
});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: "部门名称",
    prop: "deptName",
    labelWidth: 60,
    colLayout: COL_XL,
    attrs: {
      placeholder: "请输入部门名称"
    }
  },
  {
    type: FormComponentEnum.ElSelect,
    label: "部门状态",
    prop: "status",
    colLayout: COL_XL,
    attrs: {
      options: Object.values(DEPT_STATUS)
    }
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
const appTableRef = ref<{ refresh: () => void } | null>(null);
const tableData = ref<DeptRow[]>([]);
const tableTotal = ref();
const filterParams = ref({});
const handleSearch = (data?: DeptListSearch) => {
  filterParams.value = data || {};
  getDeptListApi(data || ({} as DeptListSearch))
    .then((res: any) => {
      const list = res.data?.rows || [];
      tableData.value = buildTree(list);
      tableTotal.value = res.data?.total || 0;
    })
    .catch(error => {
      if (error?.message) messageError(error.message);
    });
};

// 构建树形结构的函数
const buildTree = (departments: DeptRow[]): DeptRow[] => {
  const root: DeptRow[] = [];
  const lookup: { [key: number]: DeptRow } = {};

  // 创建所有节点的查找表
  departments.forEach(dept => {
    lookup[dept.deptId] = { ...dept };
  });

  // 遍历所有节点并构建树
  departments.forEach(dept => {
    if (dept.parentId === 0) {
      // 如果是根节点，则直接添加到rootDepartments中
      root.push(lookup[dept.deptId]);
    } else {
      // 否则找到其父节点，并添加到父节点的children属性中
      if (lookup[dept.parentId]) {
        if (!lookup[dept.parentId].children) {
          lookup[dept.parentId].children = [];
        }
        lookup[dept.parentId].children.push(lookup[dept.deptId]);
      }
    }
  });

  return root;
};
const baseFromDlgProp = reactive<{ visible: boolean; row: any }>({
  visible: false,
  row: undefined
});
const handleAdd = () => {
  baseFromDlgProp.visible = true;
};
const handleEdit = (row: DeptRow) => {
  basefromDlgProp.visible = true;
  baseFromDlgProp.row = row;
};

const handleDelete = (row: DeptRow) => {
  console.log("删除:", row);
  // 删除逻辑...
};

const exportExcelConfig = computed(() => {
  const config = {
    filename: `部门列表${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getDeptListApi,
      defaultParams: filterParams.value
    },
    buttonLabel: "导出表格"
  };
  return config;
});
onMounted(() => {
  handleSearch();
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
