<script setup lang="ts">
import type { UserRow } from "@/apis/interface/system";
import { postSystemUserCreateApi, postSystemUserUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, watch, computed } from "vue";
import { AppFormRef, FormComponentEnum } from "@/components/AppForm/type";
import { USER_STATUS } from "@/assets/constant/index";
import { COL_FULL } from "@/assets/constant/form";

const props = withDefaults(defineProps<{ row?: UserRow }>(), {
  row: () => ({}) as UserRow
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
const formData = ref<UserRow>({} as UserRow);
watch(
  () => props.row,
  (newVal: UserRow) => {
    if (Object.keys(newVal || {}).length && props?.row?.id) {
      formData.value = newVal;
    }
    // 有接口后 跟换为接口
    // handleDetailGet(newVal.id);
  },
  { deep: true, immediate: true }
);
const handleInitData = () => {
  if (!props?.row?.id) {
    formData.value = {};
  }
};
const elemColumns = computed(() => {
  return [
    {
      type: FormComponentEnum.ElInput,
      label: "用户名称",
      prop: "userName",
      colLayout: COL_FULL,
      attrs: {
        placeholder: "请输入用户名称"
      }
    },
    {
      type: FormComponentEnum.ElInput,
      label: "手机号码",
      prop: "phonenumber",
      colLayout: COL_FULL,
      attrs: {
        placeholder: "请输入手机号码"
      }
    },
    {
      type: FormComponentEnum.ElRadio,
      label: "用户状态",
      prop: "status",
      colLayout: COL_FULL,
      attrs: {},
      options: Object.values(USER_STATUS)
    },
    {
      type: FormComponentEnum.ElInput,
      label: "备注",
      prop: "remark",
      colLayout: COL_FULL,
      attrs: {}
    }
  ];
});
// const handleDetailGet = (id: string) => {
//   getSystemUserDetailApi({ id })
//     .then((res: any) => {
//       formData.value = res?.data || ({} as UserRow);
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
          await postSystemUserCreateApi(formData.value);
          messageSuccess("修改成功");
        } else {
          await postSystemUserUpdateApi(formData.value);
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

onMounted(() => {
  handleInitData();
});
</script>

<template>
  <AppDialog
    :visible="visible"
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')}用户`"
    :before-close="handleDialogClose"
    class="userFrom-dlg"
  >
    <AppForm ref="appFormRef" v-model:formModel="formData" :elemColumns="elemColumns">
      <template #oper>
        <el-button @click="handleDialogClose">{{ $t("operate.cancel") }}</el-button>
        <el-button type="primary" @click="handleSubmit">{{ $t("operate.save") }}</el-button>
      </template>
    </AppForm>
  </AppDialog>
</template>

<style lang="scss" scoped>
.userFrom-dlg {
  .el-formData {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
