<script setup lang="ts">
import BaseTinyEditor from "@/components/BaseTinyEditor/index.vue";
import type { DeptListSearch, DeptRow } from "@/apis/interface/system";
import { getDeptDetailApi, postDeptCreateApi, postDeptUpdateApi } from "@/apis/modules/system";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { ref, onMounted, reactive, watch, computed } from "vue";
import { FormComponentEnum } from "@/components/AppForm/type";
import { DEPT_STATUS } from "@/assets/constant/index";
import { getDeptListApi } from "@/apis/modules/system";
import { COL_FULL } from "@/assets/constant/form";
const visible = defineModel<boolean>("visible");
const props = withDefaults(defineProps<{ row?: DeptRow }>(), {
  row: () => ({}) as DeptRow
});

const formData = ref<DeptRow>({});
const deptList = ref([]);
const getDeptList = () => {
  getDeptListApi({} as DeptListSearch)
    .then(res => {
      deptList.value = buildTree(res.data?.rows || []);
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
// 监听 row 变化，同步更新 formData
watch(
  () => props.row,
  (newVal: DeptRow) => {
    if (newVal) {
      formData.value = newVal;
      // handleDetailGet(newVal.id);
    }
  },
  { deep: true, immediate: true }
);

const emit = defineEmits([]);
const handleDetailGet = (id: string) => {
  getDeptDetailApi(id)
    .then(res => {
      formData.value = res?.data || {};
    })
    .catch(err => {
      if (err?.message) messageError(err.message);
    });
};

// 关闭对话框
const handleDialogClose = () => {
  visible.value = false;
  formData.value = {};
};

// 提交表单
const handleSubmit = async () => {
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
  } catch (error) {
    if (err?.message) messageError(`操作失败，请稍后再试 ${err.message}`);
  }
};

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

onMounted(() => {
  getDeptList();
});
</script>

<template>
  <AppDialog
    :visible="visible"
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')}部门`"
    :before-close="handleDialogClose"
    class="deptFrom-dlg"
  >
    <AppForm v-model:formModel="formData" :elemColumns="elemColumns" />
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
