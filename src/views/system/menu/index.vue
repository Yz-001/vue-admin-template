<script setup lang="ts">
import AppMenuFromDlg from "@/views/system/menu/component/AppMenuFromDlg.vue";
import { deleteMenuApi, getMenuListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, computed, onMounted } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { MenuListSearch, MenuRow } from "@/apis/interface/system";
import { MENU_STATUS, MENU_TYPE, YESNO_TYPE } from "@/assets/constant/index";
import { commonDelBox, messageError, messageSuccess } from "@/utils/element-utils/notification-common";
import { COL_XL } from "@/assets/constant/form";
import { BaseFromDlgProp } from "@/apis/interface/common";
import { constructHierarchy } from "@/utils/common";
import { $t } from "@/plugins/i18n";

defineOptions({
  name: "MenuMain"
});

// 检索相关
let searchForm = reactive({
  menuName: "",
  status: undefined
});
const filterParams = ref({});

// 表格相关
const appTableRef = ref<{ refresh: () => void } | null>(null);
const tableData = ref<MenuRow[]>([]);
const tableTotal = ref();
const tableConfig = reactive({
  rowKey: "id",
  defaultExpandAll: true
});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: $t("menu.name"),
    prop: "menuName",
    labelWidth: 60,
    colLayout: COL_XL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElSelect,
    label: $t("menu.status"),
    prop: "visible",
    colLayout: COL_XL,
    options: Object.values(MENU_STATUS)
  }
];

// 表格列配置
const tableColumns = [
  { label: $t("menu.name"), prop: "menuName" },
  { label: $t("menu.orderNum"), prop: "orderNum", type: TableTypeEnum.NUMBER },
  { label: $t("menu.url"), prop: "url" },
  {
    label: $t("menu.menuType"),
    prop: "menuType",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: MENU_STATUS.VISIBLE.value },
    tagError: { value: MENU_STATUS.HIDDEN.value },
    selectList: Object.values(MENU_STATUS),
    labelName: "label"
  },
  {
    label: $t("menu.status"),
    prop: "visible",
    type: TableTypeEnum.SECTION,
    selectList: Object.values(MENU_STATUS)
  },
  { label: $t("menu.perms"), prop: "perms" },
  { label: $t("menu.icon"), prop: "icon" },
  {
    label: $t("menu.isRefresh"),
    prop: "isRefresh",
    type: TableTypeEnum.SECTION,
    selectList: Object.values(YESNO_TYPE)
  },
  { label: $t("common.operation"), prop: "template", type: TableTypeEnum.TEMPLATE }
];

const exportExcelConfig = computed(() => {
  const config = {
    filename: `${$t("common.export")}${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getMenuListApi,
      defaultParams: filterParams.value
    }
  };
  return config;
});

const handleSearch = (data?: MenuListSearch) => {
  filterParams.value = data || {};
  getMenuListApi(data || ({} as MenuListSearch))
    .then(res => {
      const list = res.data?.rows || [];
      tableData.value = constructHierarchy(list, {
        idKey: "menuId",
        parentIdKey: "parentId"
      }) as unknown as MenuRow[];
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
const handleEdit = (row: MenuRow) => {
  baseFromDlgProp.visible = true;
  baseFromDlgProp.row = row;
};
const handleDelete = (row: MenuRow) => {
  commonDelBox({})
    .then(_ => {
      deleteMenuApi({ id: row.id })
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
  <div class="page-container menu-list">
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

    <AppMenuFromDlg
      v-if="baseFromDlgProp.visible"
      v-model:visible="baseFromDlgProp.visible"
      :row="baseFromDlgProp.row"
    />
  </div>
</template>

<style lang="scss" scoped>
.menu-list {
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
