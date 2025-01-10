export const appLoading: any = {
  mounted(_el: any, binding: any, vnode: any) {
    addOrRemoveTagLoadClass(binding, vnode);
  },
  updated(_el: any, binding: any, vnode: any) {
    addOrRemoveTagLoadClass(binding, vnode);
  }
};
const appLoadingClassName = "app-loading";
function addOrRemoveTagLoadClass(binding: any, vnode: any) {
  if (binding.value) {
    if (!vnode.el.className.includes(appLoadingClassName)) {
      vnode.el.className += ` ${appLoadingClassName}`;
    }
  } else {
    if (vnode.el.className.includes(appLoadingClassName)) {
      vnode.el.className = vnode.el.className.replace(appLoadingClassName, "");
    }
  }
}
