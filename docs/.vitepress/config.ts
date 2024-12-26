import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: "en-US",
  title: "vue-admin-template",
  description: "快速开发模版",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    search: {
      provider: "local"
    },
    nav: [
      { text: "首页", link: "/" },
      { text: "简介", link: "/infos/index" },
      { text: "组件集合", link: "/components/index" },
      { text: "函数集合", link: "/tools/index" },
      { text: "样式布局", link: "/styles/index" },
      { text: "版本依赖", link: "/infos/version" }
    ],

    sidebar: [
      {
        text: "简介",
        link: "/infos/index"
      },
      {
        text: "组件集合",
        collapsed: false,
        link: "/components/index",
        items: [
          { text: "BaseSvgIcon", link: "/components/BaseSvgIcon" },
          { text: "BaseDragUploadDialog", link: "/components/BaseDragUploadDialog" },
          { text: "PanelCard", link: "/components/PanelCard" }
        ]
      },
      {
        text: "函数集合",
        link: "/tools/index"
      },
      {
        text: "样式布局",
        collapsed: true,
        link: "/styles/index"
      }
      // {
      //   text: "创建doc示例",
      //   items: [
      //     { text: "Markdown Examples", link: "/markdown-examples" },
      //     { text: "Runtime API Examples", link: "/api-examples" }
      //   ]
      // }
    ]

    // socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  }
});
