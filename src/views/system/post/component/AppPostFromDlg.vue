<script setup lang="ts">
import type { PostRow } from "@/apis/interface/system";
import { postSystemPostCreateApi, postSystemPostUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, watch, computed } from "vue";
import { AppFormRef, FormComponentEnum } from "@/components/AppForm/type";
import { POST_STATUS } from "@/assets/constant/index";
import { COL_FULL } from "@/assets/constant/form";

const props = withDefaults(defineProps<{ row?: PostRow }>(), {
  row: () => ({}) as PostRow
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
const formData = ref<PostRow>({} as PostRow);
watch(
  () => props.row,
  (newVal: PostRow) => {
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
    label: $t("post.name"),
    prop: "postName",
    colLayout: COL_FULL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElInput,
    label: $t("post.code"),
    prop: "postCode",
    colLayout: COL_FULL,
    attrs: {
      placeholder: $t("common.pleaseEnter")
    }
  },
  {
    type: FormComponentEnum.ElInputNumber,
    label: $t("post.postSort"),
    prop: "postSort",
    colLayout: COL_FULL,
    attrs: {}
  },
  {
    type: FormComponentEnum.ElRadio,
    label: $t("post.status"),
    prop: "status",
    colLayout: COL_FULL,
    attrs: {},
    options: Object.values(POST_STATUS)
  },
  {
    type: FormComponentEnum.ElInput,
    label: $t("post.remark"),
    prop: "remark",
    colLayout: COL_FULL,
    attrs: {}
  }
]);
// const handleDetailGet = (id: string) => {
//   getSystemPostDetailApi({ id })
//     .then((res: any) => {
//       formData.value = res?.data || ({} as PostRow);
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
          await postSystemPostCreateApi(formData.value);
          messageSuccess($t("messages.updateSuccess"));
        } else {
          await postSystemPostUpdateApi(formData.value);
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
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')} ${$t('menus.Post')}`"
    :before-close="handleDialogClose"
    class="postFrom-dlg"
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
.postFrom-dlg {
  .el-formData {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
