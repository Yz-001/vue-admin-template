<script setup lang="ts">
import type { RoleRow } from "@/apis/interface/system";
import { postSystemRoleCreateApi, postSystemRoleUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, watch, computed } from "vue";
import { AppFormRef, FormComponentEnum } from "@/components/AppForm/type";
import { ROLE_STATUS } from "@/assets/constant/index";
import { COL_FULL } from "@/assets/constant/form";

const props = withDefaults(defineProps<{ row?: RoleRow }>(), {
  row: () => ({}) as RoleRow
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
const formData = ref<RoleRow>({} as RoleRow);
watch(
  () => props.row,
  (newVal: RoleRow) => {
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
const elemColumns = computed(() => [
  {
    type: FormComponentEnum.ElInput,
    label: $t("role.name"),
    prop: "roleName",
    colLayout: COL_FULL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElInput,
    label: $t("role.permissionKey"),
    prop: "roleKey",
    colLayout: COL_FULL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElInputNumber,
    label: $t("role.roleSort"),
    prop: "roleSort",
    colLayout: COL_FULL,
    attrs: {}
  },
  {
    type: FormComponentEnum.ElRadio,
    label: $t("role.status"),
    prop: "status",
    colLayout: COL_FULL,
    attrs: {},
    options: Object.values(ROLE_STATUS)
  },
  {
    type: FormComponentEnum.ElInput,
    label: $t("role.remark"),
    prop: "remark",
    colLayout: COL_FULL,
    attrs: {}
  }
  // {
  //   type: FormComponentEnum.ElTreeSelect,
  //   label: '',
  //   prop: "menuId",
  //   labelWidth: 60,
  //   colLayout: COL_FULL,
  //   attrs: {
  //     data: [],
  //     props: {
  //       children: "children",
  //       label: "menuName",
  //       value: "menuId"
  //     }
  //   }
  // },
]);
// const handleDetailGet = (id: string) => {
//   getSystemRoleDetailApi({ id })
//     .then(res => {
//       formData.value = res?.data || ({} as RoleRow);
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
          await postSystemRoleCreateApi(formData.value);
          messageSuccess($t("messages.updateSuccess"));
        } else {
          await postSystemRoleUpdateApi(formData.value);
          messageSuccess($t("messages.createSuccess"));
        }

        handleDialogClose();
      } catch (error: any) {
        throw new Error(error);
      }
    })
    .catch((error: any) => {
      if (error?.message) messageError(`${$t("messages.operationFailed")} ${error.message}`);
    });
};

onMounted(() => {
  handleInitData();
});
</script>

<template>
  <AppDialog
    :visible="visible"
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')} ${$t('menus.Role')}`"
    :before-close="handleDialogClose"
    class="roleFrom-dlg"
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
.roleFrom-dlg {
  .el-formData {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
