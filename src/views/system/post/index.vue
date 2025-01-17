<script setup lang="ts">
import AppPostFromDlg from "@/views/system/post/component/AppPostFromDlg.vue";
import { deleteSystemPostApi, getSystemPostListApi } from "@/apis/modules/system";
import { TableTypeEnum } from "@/components/AppTable/type";
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { PostRow } from "@/apis/interface/system";
import { POST_STATUS } from "@/assets/constant/index";
import { commonDelBox, messageError, messageSuccess } from "@/utils/element-utils/notification-common";
import { COL_XL } from "@/assets/constant/form";
import { BaseFromDlgProp } from "@/apis/interface/common";

// 检索相关
const searchForm = reactive({
  postCode: "",
  postName: "",
  status: undefined
});
const filterParams = ref({});
const elemColumns = [
  {
    type: FormComponentEnum.ElInput,
    label: "岗位名称",
    prop: "postName",
    colLayout: COL_XL,
    attrs: {
      placeholder: "请输入岗位名称"
    }
  },
  {
    type: FormComponentEnum.ElInput,
    label: "岗位编码",
    prop: "postCode",
    colLayout: COL_XL,
    attrs: {
      placeholder: "请输入岗位编码"
    }
  },
  {
    type: FormComponentEnum.ElSelect,
    label: "岗位状态",
    prop: "status",
    colLayout: COL_XL,
    attrs: {
      placeholder: "请输入岗位状态"
    },
    options: Object.values(POST_STATUS)
  }
];

// 表格相关
const appTableRef = ref<{ refresh: () => void } | null>(null);
const tableData = ref<PostRow[]>([]);
const handleUpdateData = (data: any[]) => {
  tableData.value = JSON.parse(JSON.stringify(data || []));
};
const tableConfig = reactive({
  rowKey: "id",
  defaultExpandAll: true
});
const remoteConfig = {
  remoteApi: getSystemPostListApi,
  defaultParams: {},
  autoRequest: true
};
// 表格列配置
const tableColumns = [
  { label: "岗位编码", prop: "postCode" },
  { label: "岗位名称", prop: "postName" },
  { label: "显示顺序", prop: "postSort", type: TableTypeEnum.NUMBER },
  {
    label: "岗位状态",
    prop: "status",
    type: TableTypeEnum.SECTION,
    tagSuccess: { value: POST_STATUS.NORMAL.value },
    tagError: { value: POST_STATUS.PAUSE.value },
    selectList: Object.values(POST_STATUS),
    labelName: "label"
  },
  { label: "创建时间", prop: "createTime", type: TableTypeEnum.DATE },
  { label: "操作", prop: "template", type: TableTypeEnum.TEMPLATE }
];

const exportExcelConfig = computed(() => {
  const config = {
    filename: `导出${new Date().getTime()}`,
    excelElemColumns: tableColumns?.filter(i => i.prop != "template") || [],
    remoteConfig: {
      remoteApi: getSystemPostListApi,
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
const handleEdit = (row: PostRow) => {
  baseFromDlgProp.visible = true;
  baseFromDlgProp.row = row;
};
const handleDelete = (row: PostRow) => {
  commonDelBox({})
    .then(_ => {
      deleteSystemPostApi({ id: row.id })
        .then((_: any) => {
          messageSuccess("删除成功");
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
  <div class="page-container post-list">
    <AppFilterForm
      v-model:formModel="searchForm"
      :elemColumns="elemColumns"
      @onSearch="handleSearch"
      @onReset="handleSearch"
    />

    <AppTable
      ref="appTableRef"
      class="post-list__table"
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

    <AppPostFromDlg
      v-if="baseFromDlgProp.visible"
      v-model:visible="baseFromDlgProp.visible"
      :row="baseFromDlgProp.row"
    />
  </div>
</template>

<style lang="scss" scoped>
.post-list {
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
