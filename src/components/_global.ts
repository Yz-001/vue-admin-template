import PanelCard from "./PanelCard.vue";
import AppWarpChar from "./AppWarpChar.vue";
import BaseEmpty from "./BaseEmpty.vue";
import BaseSvgIcon from "./BaseSvgIcon.vue";
import AppAutoLoginVal from "./AppAutoLoginVal.vue";

export const components = (app: any) => {
  //获取同级目录下的.vue文件
  app.component("PanelCard", PanelCard);
  app.component("AppWarpChar", AppWarpChar);
  app.component("BaseEmpty", BaseEmpty);
  app.component("SvgIcon", BaseSvgIcon);
  app.component("AppAutoLoginVal", AppAutoLoginVal);
  // // require.context('.', true, /(App|Panel)\w+\.(vue|js)$/)
  // const requireComponent = import.meta.globEager("./*.vue")
  // requireComponent.keys().forEach((fileName: any) => {
  //   //fileName：同级目录所有的.vue文件
  //   const config = requireComponent(fileName);
  //   //获取到的文件名替换掉不需要的字符
  //   const componentName = fileName.replace('./', '').replace('.vue', '');
  //   //接收到的实例进行全局组件的挂载
  //   app.component(componentName, config.default || config)
  // })
};
