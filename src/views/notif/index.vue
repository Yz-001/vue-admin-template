<template>
  <div class="page-container notification-list">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="标题">
        <el-input v-model="searchForm.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="通知时间范围">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="handleSearch">查询</el-button>
        <el-button type="primary" class="ml-auto" @click="handleAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="notifList" class="w-full">
      <el-table-column prop="title" label="标题" width="180" />
      <el-table-column prop="content" label="通知内容" />
      <el-table-column prop="timeRange" label="通知时间范围" width="200">
        <template #default="scope"> {{ scope.row.startTime }} 至 {{ scope.row.endTime }} </template>
      </el-table-column>
      <el-table-column prop="updatedBy" label="更新人" width="100" />
      <el-table-column fixed="right" label="操作" width="150">
        <template #default="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AppNotifFromDlg
      v-if="notifFromDlgProp.visible"
      v-model:visible="notifFromDlgProp.visible"
      :row="notifFromDlgProp.row"
    />
  </div>
</template>

<script setup lang="ts">
import AppNotifFromDlg from "@/views/notif/component/AppNotifFromDlg.vue";
import { getNotifListApi } from "@/apis/modules/notif";
import type { NotifRow } from "@/apis/interface/notif";

const searchForm = reactive({
  title: "",
  dateRange: [] as [string, string]
});

const notifList = ref<NotifRow[]>([]);

const handleSearch = async () => {
  try {
    const response = await getNotifListApi({
      title: searchForm.title,
      startDate: searchForm.dateRange[0],
      endDate: searchForm.dateRange[1]
    });
    notifList.value = response.data;
  } catch (error) {
    console.error("Failed to fetch notifList:", error);
  }
};
const notifFromDlgProp = reactive({
  visible: false,
  row: undefined
});
const handleAdd = () => {
  notifFromDlgProp.visible = true;
};
const handleEdit = (row: NotifRow) => {
  notifFromDlgProp.visible = true;
  notifFromDlgProp.row = row;
};

const handleDelete = (row: NotifRow) => {
  console.log("删除:", row);
  // 删除逻辑...
};

// 初始加载数据
handleSearch();
</script>

<style scoped>
.notification-list {
  padding: 20px;
}
</style>
