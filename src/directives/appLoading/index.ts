export const appLoading: any = {
  mounted(el, binding, vnode) {
    addOrRemoveTagLoadClass(binding, vnode);
  },
  updated(el, binding, vnode) {
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
