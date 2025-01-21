<script setup lang="ts">
import AppRoleFromDlg from "@/views/system/role/component/AppRoleFromDlg.vue";
import { deleteSystemRoleApi, getSystemRoleListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { RoleRow } from "@/apis/interface/system";
import { ROLE_STATUS } from "@/assets/constant/index";
import { commonDelBox, messageError, messageSuccess } from "@/utils/element-utils/notification-common";
import { COL_XL } from "@/assets/constant/form";
import { BaseFromDlgProp } from "@/apis/interface/common";
import { $t } from "@/plugins/i18n";

defineOptions({
  name: "RoleMain"
});

// 检索相关
let searchForm = reactive({
  roleName: "",
  roleKey: "",
  status: undefined
});
const filterParams = ref({});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: $t("role.name"),
    prop: "roleName",
    colLayout: COL_XL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElInput,
    label: $t("role.permissionKey"),
    prop: "roleKey",
    colLayout: COL_XL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElSelect,
    label: $t("role.status"),
    prop: "status",
    colLayout: COL_XL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElDatePicker,
    label: $t("role.createDate"),
    prop: "createDate",
    colLayout: COL_XL,
    attrs: {
      type: "datetimerange",
      rangeSeparator: $t("common.to"),
      startPlaceholder: $t("common.pleaseEnterStartDate"),
      endPlaceholder: $t("common.pleaseEnterEndDate"),
      placeholder: $t("common.pleaseEnter")
    }
  }
];

// 表格相关
const appTableRef = ref<{ refresh: () => void } | null>(null);
const tableData = ref<RoleRow[]>([]);
const handleUpdateData = (data: any[]) => {
  tableData.value = JSON.parse(JSON.stringify(data || []));
};
const tableConfig = reactive({
  rowKey: "id",
  defaultExpandAll: true
});
const remoteConfig = {
  remoteApi: getSystemRoleListApi,
  defaultParams: {},
  autoRequest: true
};
// 表格列配置
const tableColumns = [
  { label: $t("role.name"), prop: "roleName" },
  { label: $t("role.permissionKey"), prop: "roleKey" },
  { label: $t("role.dataScope"), prop: "dataScope" },
  { label: $t("role.roleSort"), prop: "roleSort", type: TableTypeEnum.NUMBER },
  {
    label: $t("role.status"),
    prop: "status",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: ROLE_STATUS.NORMAL.value },
    tagError: { value: ROLE_STATUS.PAUSE.value },
    selectList: Object.values(ROLE_STATUS),
    labelName: "label"
  },
  { label: $t("role.remark"), prop: "remark" },
  { label: $t("role.createDate"), prop: "createTime", type: TableTypeEnum.DATE },
  { label: $t("common.operation"), prop: "template", type: TableTypeEnum.TEMPLATE }
];

const exportExcelConfig = computed(() => {
  const config = {
    filename: `${$t("common.export")}${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getSystemRoleListApi,
      defaultParams: filterParams.value
    }
  };
  return config;
});

const handleSearch = (data?: { [key: string]: any }) => {
  filterParams.value = data ?? {};
  nextTick(() => {
    if (appTableRef.value) appTableRef.value.refresh();
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
const handleEdit = (row: RoleRow) => {
  baseFromDlgProp.visible = true;
  baseFromDlgProp.row = row;
};
const handleDelete = (row: RoleRow) => {
  commonDelBox({})
    .then(_ => {
      deleteSystemRoleApi({ id: row.id })
        .then(_ => {
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
  <div class="page-container role-list">
    <AppFilterForm
      v-model:formModel="searchForm"
      :elemColumns="elemColumns"
      @onSearch="handleSearch"
      @onReset="handleSearch"
    />

    <AppTable
      ref="appTableRef"
      class="role-list__table"
      :elemColumns="tableColumns"
      :tableConfig="tableConfig"
      :remoteConfig="remoteConfig"
      :filterParams="filterParams"
      :exportExcelConfig="exportExcelConfig"
      @update:data="handleUpdateData"
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

    <AppRoleFromDlg
      v-if="baseFromDlgProp.visible"
      v-model:visible="baseFromDlgProp.visible"
      :row="baseFromDlgProp.row"
    />
  </div>
</template>

<style lang="scss" scoped>
.role-list {
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
