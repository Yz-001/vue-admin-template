// import * as Ripple from "./ripple";
// import { ElSelectLoading } from "./elSelectLoading";
import { ElSelectLoadMore } from "./elSelectLoadMore";
import { appLoading } from "./appLoading";

const directivesList = [
  // { name: "ripple", fn: Ripple },
  // { name: "elSelectLoading", fn: ElSelectLoading },
  { name: "elSelectLoadMore", fn: ElSelectLoadMore },
  { name: "appLoading", fn: appLoading }
];
export const directives = (app: any) => {
  directivesList.forEach(({ name, fn }) => {
    app.directive(name, fn);
  });
};
