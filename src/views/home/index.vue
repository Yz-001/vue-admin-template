<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
import { ElTable, ElTableColumn, ElTag, ElCard, ElRow, ElCol } from "element-plus";
import { UserFilled, List, Paperclip } from "@element-plus/icons-vue";

// 定义组件选项
defineOptions({
  name: "Home"
});

// 静态数据模拟后台首页信息
const dashboardInfo = ref([
  {
    title: "用户总数",
    count: 12345,
    icon: UserFilled
  },
  {
    title: "文章数量",
    count: 54321,
    icon: List
  },
  {
    title: "评论数",
    count: 9876,
    icon: Paperclip
  }
]);

// 模拟用户列表数据
const users = ref([
  { key: "1", name: "John Brown", age: 32, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", age: 42, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", age: 32, address: "Sidney No. 1 Lake Park" }
]);

// 模拟最近活动日志数据
const activities = ref([
  { content: "admin 在 10分钟前 登录系统", timestamp: "2018-05-15" },
  { content: "editor 在 1小时前 编辑文章", timestamp: "2018-02-15" }
]);

// 初始化图表
onMounted(() => {
  const chartDom = document.getElementById("main")!;
  const myChart = echarts.init(chartDom);
  const option = {
    grid: {
      top: "20%",
      left: "3%",
      right: "1%"
    },
    title: {
      text: "访问量"
    },
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    yAxis: {
      type: "value"
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: "line"
      }
    ]
  };
  myChart.setOption(option);
});
</script>

<template>
  <div class="page-container home-page">
    <main class="flex-grow p-4 overflow-y-auto">
      <section>
        <el-row :gutter="20">
          <el-col v-for="item in dashboardInfo" :key="item.title" :span="8">
            <el-card shadow="hover">
              <div class="home-page__dashboards">
                <component :is="item.icon" class="home-page__dashboards__icon" />
                <div class="home-page__dashboards__title">
                  <p>{{ item.title }}</p>
                  <h3 class="m-0 text-xl">{{ item.count }}</h3>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div id="main" class="mt-6 h-[350px]" />
      </section>
      <el-row :gutter="20">
        <el-col :span="18">
          <section class="mt-4">
            <h3 class="mb-4">用户列表</h3>
            <el-table :data="users">
              <el-table-column prop="name" label="姓名" width="180" />
              <el-table-column prop="age" label="年龄" width="180" />
              <el-table-column prop="address" label="地址" />
              <el-table-column label="标签">
                <template #default="scope">
                  <el-tag>{{ scope.row.age }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </el-col>
        <el-col :span="6">
          <section class="mt-4">
            <h3 class="mb-4">最近活动</h3>
            <!-- <ul class="home-page__activities">
              <li v-for="activity in activities" :key="activity.time" class="mb-2">
                <strong>{{ activity.user }}</strong> 在 {{ activity.time }} {{ activity.action }}
              </li>
            </ul> -->
            <el-timeline class="home-page__activities">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </section>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  &__dashboards {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &__icon {
      width: 36px;
    }

    svg {
      color: var(--el-color-primary);
    }
  }

  &__activities {
    margin-top: 26px;
  }
}
</style>
