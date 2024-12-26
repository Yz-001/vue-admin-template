<template>
  <el-breadcrumb class="base-breadCrumb" separator="/">
    <template v-for="item in breadCrumbList" :key="item.path">
      <el-breadcrumb-item v-if="!item?.noTo" :to="{ path: item.path }">
        {{ item.meta?.title ? $t(item.meta.title) : "" }}
      </el-breadcrumb-item>
      <el-breadcrumb-item v-else>
        {{ item.meta?.title ? $t(item.meta.title) : "" }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
defineOptions({
  name: "BaseBreadCrumb"
});

const route = useRoute();
const breadCrumbList = computed<BreadCrumb[]>(() => {
  let routeBreadCrumb = [];
  // 隐藏面包屑
  if (route.meta?.breadcrumbHide) return;
  if (route.meta?.breadCrumb) {
    // 自定义
    routeBreadCrumb = route.meta?.breadCrumb as BreadCrumb[];
  } else {
    // 自动生成 noTo不允许跳转 默认都是允许 注意：下拉有子页面，菜单文件夹无点击功能
    routeBreadCrumb = route.matched
      ?.filter(f => f.name)
      ?.map(i => ({ path: i.path, meta: { title: i.meta?.title }, noTo: !!i.children }));
  }
  if (route.path != "/home" && routeBreadCrumb?.length && routeBreadCrumb[0]?.path != "/home") {
    routeBreadCrumb.unshift({ path: "/home", meta: { title: "menus.Home" }, noTo: false });
  }
  return routeBreadCrumb;
});
interface BreadCrumb {
  path: string;
  meta: { title: string };
  noTo: Boolean;
}
</script>

<style lang="scss" scoped>
.base-breadCrumb {
  margin-left: 5px;

  .el-breadcrumb__item {
    // --el-text-color-primary: #999;
    .el-breadcrumb__inner a span {
      font-weight: none !important;
    }

    &[aria-current="page"] {
      color: #333;
    }

    .el-breadcrumb__separator {
      --el-text-color-placeholder: #999;
    }
  }
}
</style>
