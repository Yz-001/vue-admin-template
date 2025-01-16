<script setup lang="ts">
import type { DeptListSearch, DeptRow } from "@/apis/interface/system";
import { postDeptCreateApi, postDeptUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, watch, computed } from "vue";
import { AppFormRef, FormComponentEnum } from "@/components/AppForm/type";
import { DEPT_STATUS } from "@/assets/constant/index";
import { getDeptListApi } from "@/apis/modules/system";
import { COL_FULL } from "@/assets/constant/form";
import { constructHierarchy } from "@/utils/common";

const props = withDefaults(defineProps<{ row?: DeptRow }>(), {
  row: () => ({}) as DeptRow
});
const emit = defineEmits([]);

// 弹窗相关
const visible = defineModel<boolean>("visible");
// 关闭对话框
const handleDialogClose = () => {
  formData.value = {};
  visible.value = false;
};

// 表单相关
const appFormRef = ref<AppFormRef | null>(null);
const formData = ref<DeptRow>({} as DeptRow);
watch(
  () => props.row,
  (newVal: DeptRow) => {
    if (newVal) {
      if (Object.keys(newVal).length) {
        formData.value = newVal;
      }
      // 有接口后 跟换为接口
      // handleDetailGet(newVal.id);
    }
  },
  { deep: true, immediate: true }
);
const handleInitData = () => {
  getDeptList();
  if (!props?.row?.id) {
    formData.value = {};
  }
};
// 上级部门相关
const deptList = ref<DeptRow[]>([]);
const getDeptList = () => {
  getDeptListApi({} as DeptListSearch)
    .then((res: any) => {
      const list = res.data?.rows || [];
      deptList.value = constructHierarchy<DeptRow>(list, {
        idKey: "deptId",
        parentIdKey: "parentId"
      }) as unknown as DeptRow[];
    })
    .catch(error => {
      if (error?.message) messageError(error.message);
    });
};
const elemColumns = computed(() => {
  const deptOptions = deptList.value || [];
  return [
    {
      type: FormComponentEnum.ElTreeSelect,
      label: "上级部门",
      prop: "parentId",
      labelWidth: 60,
      colLayout: COL_FULL,
      attrs: {
        data: deptOptions,
        props: {
          children: "children",
          label: "deptName",
          value: "deptId"
        }
      }
    },
    {
      type: FormComponentEnum.ElInput,
      label: "部门名称",
      prop: "deptName",
      colLayout: COL_FULL,
      attrs: {}
    },
    {
      type: FormComponentEnum.ElInputNumber,
      label: "显示排序",
      prop: "orderNum",
      colLayout: COL_FULL,
      attrs: {}
    },
    {
      type: FormComponentEnum.ElInput,
      label: " 负 责 人",
      prop: "leader",
      colLayout: COL_FULL,
      attrs: {}
    },
    {
      type: FormComponentEnum.ElRadio,
      label: "部门状态",
      prop: "status",
      colLayout: COL_FULL,
      attrs: {
        options: Object.values(DEPT_STATUS)
      }
    }
  ];
});
// const handleDetailGet = (id: string) => {
//   getDeptDetailApi({ id })
//     .then((res: any) => {
//       formData.value = res?.data || ({} as DeptRow);
//     })
//     .catch(err => {
//       if (err?.message) messageError(err.message);
//     });
// };

// 提交表单
const handleSubmit = async () => {
  if (!appFormRef.value) return;
  appFormRef.value
    .getValidate()
    .then(async (valid: boolean) => {
      try {
        if (formData.value.id) {
          // 修改通知
          await postDeptCreateApi(formData.value);
          messageSuccess("修改成功");
        } else {
          await postDeptUpdateApi(formData.value);
          messageSuccess("新增成功");
        }

        handleDialogClose();
      } catch (error: any) {
        throw new Error(error);
      }
    })
    .catch((error: any) => {
      if (error?.message) messageError(`操作失败，请稍后再试 ${error.message}`);
    });
};
// const handleReset = () => {
//   if (!appFormRef.value) return;
//   appFormRef.value.handleReset();
// };

onMounted(() => {
  handleInitData();
});
</script>

<template>
  <AppDialog
    :visible="visible"
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')}部门`"
    :before-close="handleDialogClose"
    class="deptFrom-dlg"
  >
    <AppForm ref="appFormRef" v-model:formModel="formData" :elemColumns="elemColumns">
      <template #oper>
        <el-button @click="handleDialogClose">{{ $t("operate.cancel") }}</el-button>
        <!-- <el-button @click="handleReset">{{ $t("operate.reset") }}</el-button> -->
        <el-button type="primary" @click="handleSubmit">{{ $t("operate.save") }}</el-button>
      </template>
    </AppForm>
  </AppDialog>
</template>

<style lang="scss" scoped>
.deptFrom-dlg {
  .el-formData {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
