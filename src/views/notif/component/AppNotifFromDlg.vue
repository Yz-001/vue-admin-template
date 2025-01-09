<script setup lang="ts">
import BaseTinyEditor from "@/components/BaseTinyEditor/index.vue";
import type { NotifRow } from "@/apis/interface/notif";
import { postNotifCreateApi, postNotifUpdateApi } from "@/apis/modules/notif";
import { messageSuccess, messageError } from "@/utils/element-utils/notification-common";
import { $t } from "@/plugins/i18n";
import { reactive, watch } from "vue";

const visible = defineModel<boolean>("visible");
const props = withDefaults(defineProps<{ row?: NotifRow }>(), {
  row: () => ({}) as NotifRow
});

const form = reactive<NotifRow>({
  id: props.row?.id,
  title: props.row?.title || "",
  content: props.row?.content || "",
  timeRange: [props.row?.startTime, props.row?.endTime]
});

// 监听 row 变化，同步更新 form
watch(
  () => props.row,
  newVal => {
    if (newVal) {
      form.id = newVal.id;
      form.title = newVal.title || "";
      form.content = newVal.content || "";
      form.timeRange = newVal.timeRange || [];
    }
  },
  { deep: true, immediate: true }
);

// 关闭对话框
const emit = defineEmits([]);
const handleDialogClose = () => {
  visible.value = false;
  // emit("update:visible", false);
};

// 提交表单
const handleSubmit = async () => {
  try {
    if (form.id) {
      // 修改通知
      await postNotifCreateApi(form);
      messageSuccess("通知修改成功");
    } else {
      await postNotifUpdateApi(form);
      messageSuccess("通知新增成功");
    }

    handleDialogClose();
  } catch (error) {
    messageError("操作失败，请稍后再试");
    console.error("Failed to submit:", error);
  }
};
</script>

<template>
  <AppDialog
    :visible="visible"
    :title="`${row?.id ? $t('operate.edit') : $t('operate.newCreate')}通知`"
    :before-close="handleDialogClose"
    class="notifFrom-dlg"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="通知内容" prop="content">
        <BaseTinyEditor v-model:htmlContent="form.content" class="h-[350px]" />
      </el-form-item>
      <el-form-item label="通知时间" prop="timeRange">
        <el-date-picker
          v-model="form.timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleDialogClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </AppDialog>
</template>

<style lang="scss" scoped>
.notifFrom-dlg {
  .el-form {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>
