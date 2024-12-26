// import type { Directive } from "vue";
import * as Ripple from "./ripple";
import { ElSelectLoadMore } from "./elSelectLoadMore";
import { ElSelectLoading } from "./elSelectLoading";
import { appLoading } from "./appLoading";

const directivesList = [
  { name: "ripple", fn: Ripple },
  { name: "elSelectLoadMore", fn: ElSelectLoadMore },
  { name: "elSelectLoading", fn: ElSelectLoading },
  { name: "appLoading", fn: appLoading }
];
export const directives = (app: any) => {
  directivesList.forEach(({ name, fn }) => {
    app.directive(name, fn);
  });
};
