import BaseEmpty from "./BaseEmpty/index.vue";
import BaseSvgIcon from "./BaseSvgIcon/index.vue";
import AppFilterForm from "./AppFilterForm/index.vue";

// 设置全局公共组件
export const components = (app: any) => {
  app.component("AppFilterForm", AppFilterForm);
  app.component("BaseEmpty", BaseEmpty);
  app.component("SvgIcon", BaseSvgIcon);
};
