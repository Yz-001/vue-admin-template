<script setup lang="ts">
import { ref, onMounted, shallowRef } from "vue";
import * as echarts from "echarts";
import { ElTable, ElTableColumn, ElTag, ElCard, ElRow, ElCol } from "element-plus";
import { UserFilled, List, Paperclip } from "@element-plus/icons-vue";
import { $t } from "@/plugins/i18n";
import BaseEchar from "@/components/BaseEchar/index.vue";
// 定义组件选项
defineOptions({
  name: "Home"
});

// 静态数据模拟后台首页信息
const dashboardInfo = shallowRef([
  {
    title: $t("home.user_total"),
    count: 12345,
    icon: UserFilled
  },
  {
    title: $t("home.article_count"),
    count: 54321,
    icon: List
  },
  {
    title: $t("home.comment_count"),
    count: 9876,
    icon: Paperclip
  }
]);

// 模拟用户列表数据
const users = ref([
  { key: "1", name: "John Brown", phone: 132, address: "New York No. 1 Lake Park" },
  { key: "2", name: "Jim Green", phone: 122, address: "London No. 1 Lake Park" },
  { key: "3", name: "Joe Black", phone: 132, address: "Sidney No. 1 Lake Park" }
]);

// 模拟最近活动日志数据
const activities = ref([
  { content: "admin 在 10分钟前 登录系统", timestamp: "2025-02-15" },
  { content: "editor 在 1小时前 编辑通知", timestamp: "2025-02-15" },
  { content: "editor 在 3小时前 编辑通知", timestamp: "2025-02-15" }
]);

// 访问量echart options
const visitCountOptions = ref({
  color: ["#80FFA5", "#00DDFF", "#37A2FF"],
  title: {
    text: "Gradient Stacked Area Chart"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
    }
  },
  legend: {
    data: ["Line 1", "Line 2", "Line 3"]
  },
  grid: {
    left: "3%",
    right: "3%",
    bottom: "3%",
    containLabel: true
  },
  title: {
    text: $t("home.visit_count")
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "Line 1",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(128, 255, 165)"
          },
          {
            offset: 1,
            color: "rgb(1, 191, 236)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [140, 232, 101, 264, 90, 340, 250]
    },
    {
      name: "Line 2",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(0, 221, 255)"
          },
          {
            offset: 1,
            color: "rgb(77, 119, 255)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [120, 282, 111, 234, 220, 340, 310]
    },
    {
      name: "Line 3",
      type: "line",
      stack: "Total",
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: "rgb(55, 162, 255)"
          },
          {
            offset: 1,
            color: "rgb(116, 21, 219)"
          }
        ])
      },
      emphasis: {
        focus: "series"
      },
      data: [320, 132, 201, 334, 190, 130, 220]
    }
  ]
});
</script>

<template>
  <div class="page-container home-page">
    <main class="flex-grow">
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
      </section>

      <el-card shadow="hover" class="mt-6">
        <div class="w-full h-[350px]">
          <BaseEchar :options="visitCountOptions" />
        </div>
      </el-card>

      <el-row :gutter="20" class="h-[300px]">
        <el-col :span="18">
          <el-card shadow="hover" class="mt-3">
            <h3 class="mb-4">{{ `${$t("menus.User")}${$t("common.list")}` }}</h3>
            <el-table :data="users">
              <el-table-column prop="name" :label="$t('user.name')" width="180" />
              <el-table-column prop="phone" :label="$t('user.phone')" width="180" />
              <el-table-column :label="$t('user.status')">
                <template #default="scope">
                  <el-tag>{{ scope.row.address }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="home-page__activities mt-3">
            <h3 class="mb-7">{{ `${$t("menus.Notif")}${$t("common.list")}` }}</h3>
            <el-timeline>
              <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp">
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;
  padding-top: 20px;
  overflow-y: hidden;

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
    height: 252px;
  }
}
</style>
