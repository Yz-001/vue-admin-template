<script setup lang="ts">
import type { MenuListSearch, MenuRow } from "@/apis/interface/system";
import { postMenuCreateApi, postMenuUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, watch, computed } from "vue";
import { AppFormRef, FormComponentEnum } from "@/components/AppForm/type";
import { getMenuListApi } from "@/apis/modules/system";
import { COL_FULL } from "@/assets/constant/form";
import { constructHierarchy } from "@/utils/common";
import { MENU_STATUS, MENU_TYPE, YESNO_TYPE } from "@/assets/constant/index";

const props = withDefaults(defineProps<{ row?: MenuRow }>(), {
  row: () => ({}) as MenuRow
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
const formData = ref<MenuRow>({} as MenuRow);
watch(
  () => props.row,
  (newVal: MenuRow) => {
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
  getMenuList();
  if (!props?.row?.id) {
    formData.value = {};
  }
};
// 上级菜单相关
const menuList = ref<MenuRow[]>([]);
const getMenuList = () => {
  getMenuListApi({} as MenuListSearch)
    .then((res: any) => {
      const list = res.data?.rows || [];
      menuList.value = constructHierarchy<MenuRow>(list, {
        idKey: "menuId",
        parentIdKey: "parentId"
      }) as unknown as MenuRow[];
    })
    .catch(error => {
      if (error?.message) messageError(error.message);
    });
};
const elemColumns = computed(() => {
  const menuOptions = menuList.value || [];
  return [
    {
      type: FormComponentEnum.ElTreeSelect,
      label: "上级菜单",
      prop: "parentId",
      labelWidth: 60,
      colLayout: COL_FULL,
      attrs: {
        data: menuOptions,
        props: {
          children: "children",
          label: "menuName",
          value: "menuId"
        }
      }
    },
    {
      type: FormComponentEnum.ElRadio,
      label: "菜单类型",
      prop: "status",
      colLayout: COL_FULL,
      attrs: {
        options: Object.values(MENU_TYPE)
      }
    },
    {
      type: FormComponentEnum.ElInput,
      label: "菜单名称",
      prop: "menuName",
      colLayout: COL_FULL,
      attrs: {}
    },
    {
      type: FormComponentEnum.ElInput,
      label: "请求地址",
      prop: "url",
      colLayout: COL_FULL,
      attrs: {}
    },
    {
      type: FormComponentEnum.ElInput,
      label: "权限标识",
      prop: "perms",
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
      type: FormComponentEnum.ElRadio,
      label: "是否刷新",
      prop: "isRefresh",
      colLayout: COL_FULL,
      attrs: {
        options: Object.values(YESNO_TYPE)
      }
    },
    {
      type: FormComponentEnum.ElRadio,
      label: "菜单状态",
      prop: "status",
      colLayout: COL_FULL,
      attrs: {
        options: Object.values(MENU_STATUS)
      }
    }
  ];
});
// const handleDetailGet = (id: string) => {
//   getMenuDetailApi({ id })
//     .then((res: any) => {
//       formData.value = res?.data || ({} as MenuRow);
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
          await postMenuCreateApi(formData.value);
          messageSuccess("修改成功");
        } else {
          await postMenuUpdateApi(formData.value);
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
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')}菜单`"
    :before-close="handleDialogClose"
    class="menuFrom-dlg"
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
.menuFrom-dlg {
  .el-formData {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
