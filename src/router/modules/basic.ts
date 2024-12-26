import type { RouteRecordRaw } from "vue-router";
import Layout from "@/layout/index.vue";
// 示例
// {
//   path: "路径",
//   name: "唯一名",
//   meta: {
//     hidden: true,                   // MENU隐藏  当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
//     icon: "element icon name",
//     title: i18n name,               // MENU菜单名称
//     outLink: "https://xxx.com/",    // 外联地址，直接打开新页面
//     iframeLink: "https://xxx.com/", // 内嵌iframe地址
//     tabTitle: i18n name;            // TAB名称
//     tabFixation: true               // TAB固定 一般是首页
//     breadcrumbHide: false           // 面包屑隐藏 默认false 枚举：true不隐藏/false隐藏
//     breadCrumb:[{ name: "routerName", meta: { title: "i18n title" } }] // 自定义面包屑
//     activeMenu: 'name'              // 高光MENU的path。
//     allowRepeatTab: false           // 允许多开 默认false 枚举：true多开/false不多开 多开注意：1. path一定要加"/:tagId"区分 2.TAB固定不做多开
//     noCache:false                   // 不缓存 默认false 枚举：true不缓存/不传或false缓存
//   },
//   children: [],
//   component: () => import("")
// }
export const BasicRouter: Array<RouteRecordRaw> = [
  {
    path: "",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        meta: {
          icon: "House",
          title: "menus.Home",
          activeMenu: "Home",
          hidden: false,
          tabFixation: true,
          tabTitle: "menus.Home"
        },
        component: () => import("@/views/home/index.vue")
      }
    ]
  }
];
