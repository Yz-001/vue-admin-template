import BaseEmpty from "./BaseEmpty/index.vue";
import BaseSvgIcon from "./BaseSvgIcon/index.vue";
import AppFilterForm from "./AppFilterForm/index.vue";
import AppTable from "./AppTable/index.vue";
import AppDialog from "./AppDialog/index.vue";
import AppDrawer from "./AppDrawer/index.vue";

// 设置全局公共组件
export const components = (app: any) => {
  app.component("AppFilterForm", AppFilterForm);
  app.component("AppTable", AppTable);
  app.component("AppDialog", AppDialog);
  app.component("AppDrawer", AppDrawer);
  app.component("BaseEmpty", BaseEmpty);
  app.component("SvgIcon", BaseSvgIcon);
};
