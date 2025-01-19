<script setup lang="ts">
import AppDeptFromDlg from "@/views/system/dept/component/AppDeptFromDlg.vue";
import { deleteDeptApi, getDeptListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, computed, onMounted } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { DeptListSearch, DeptRow } from "@/apis/interface/system";
import { DEPT_STATUS } from "@/assets/constant/index";
import { commonDelBox, messageError, messageSuccess } from "@/utils/element-utils/notification-common";
import { COL_XL } from "@/assets/constant/form";
import { BaseFromDlgProp } from "@/apis/interface/common";
import { constructHierarchy } from "@/utils/common";
import { $t } from "@/plugins/i18n";

// 检索相关
const searchForm = reactive({
  deptName: "",
  status: undefined
});
const filterParams = ref({});

// 表格相关
const appTableRef = ref<{ refresh: () => void } | null>(null);
const tableData = ref<DeptRow[]>([]);
const tableTotal = ref();
const tableConfig = reactive({
  rowKey: "id",
  defaultExpandAll: true
});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: $t("dept.name"),
    prop: "deptName",
    labelWidth: 60,
    colLayout: COL_XL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElSelect,
    label: $t("dept.status"),
    prop: "status",
    colLayout: COL_XL,
    options: Object.values(DEPT_STATUS)
  }
];

// 表格列配置
const tableColumns = [
  { label: $t("dept.name"), prop: "deptName" },
  { label: $t("dept.orderNum"), prop: "orderNum", type: TableTypeEnum.NUMBER },
  {
    label: $t("dept.status"),
    prop: "status",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: DEPT_STATUS.NORMAL.value },
    tagError: { value: DEPT_STATUS.PAUSE.value },
    selectList: Object.values(DEPT_STATUS),
    labelName: "label"
  },
  { label: $t("dept.createTime"), prop: "createTime", type: TableTypeEnum.DATE },
  { label: $t("common.operation"), prop: "template", type: TableTypeEnum.TEMPLATE }
];

const exportExcelConfig = computed(() => {
  const config = {
    filename: `${$t("common.export")}${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getDeptListApi,
      defaultParams: filterParams.value
    }
  };
  return config;
});

const handleSearch = (data?: DeptListSearch) => {
  filterParams.value = data || {};
  getDeptListApi(data || ({} as DeptListSearch))
    .then((res: any) => {
      const list = res.data?.rows || [];
      tableData.value = constructHierarchy<DeptRow>(list, {
        idKey: "deptId",
        parentIdKey: "parentId"
      }) as unknown as DeptRow[];
      tableTotal.value = res.data?.total || 0;
    })
    .catch(error => {
      if (error?.message) messageError(error.message);
    });
};

// 常规新增/修改/删除操作相关
const baseFromDlgProp = reactive<BaseFromDlgProp>({
  visible: false,
  row: undefined
});
const handleAdd = () => {
  baseFromDlgProp.visible = true;
  baseFromDlgProp.row = null;
};
const handleEdit = (row: DeptRow) => {
  baseFromDlgProp.visible = true;
  baseFromDlgProp.row = row;
};
const handleDelete = (row: DeptRow) => {
  commonDelBox({})
    .then(_ => {
      deleteDeptApi({ id: row.id })
        .then((_: any) => {
          messageSuccess($t("common.deleteSuccess"));
          handleSearch();
        })
        .catch(error => {
          if (error?.message) messageError(error.message);
        });
    })
    .catch(error => {
      if (error?.message) messageError(error.message);
    });
};

onMounted(() => {
  handleSearch();
});
</script>

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
        <el-button type="primary" class="ml-auto" @click="handleAdd">{{ $t("operate.newCreate") }}</el-button>
      </template>
      <template #template="scope">
        <el-button link type="primary" size="small" @click="handleEdit(scope.row)">{{ $t("operate.edit") }}</el-button>
        <el-button link type="danger" size="small" @click="handleDelete(scope.row)">
          {{ $t("operate.delete") }}
        </el-button>
      </template>
    </AppTable>

    <AppDeptFromDlg
      v-if="baseFromDlgProp.visible"
      v-model:visible="baseFromDlgProp.visible"
      :row="baseFromDlgProp.row"
    />
  </div>
</template>

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
