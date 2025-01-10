export const ElSelectLoading: any = {
  mounted(_el: any, binding: any, vnode: any) {
    addOrRemoveTagLoadClass(binding, vnode);
  },
  updated(_el: any, binding: any, vnode: any) {
    addOrRemoveTagLoadClass(binding, vnode);
  }
};
const classTypeNames = {
  inner: "select-inner-loading",
  tag: "select-tag-loading"
};
function addOrRemoveTagLoadClass(binding: any, vnode: any) {
  if (binding.value) {
    if (!vnode.el.className.includes(classTypeNames[binding.arg])) {
      vnode.el.className += ` ${classTypeNames[binding.arg]}`;
    }
  } else {
    if (vnode.el.className.includes(classTypeNames[binding.arg])) {
      vnode.el.className = vnode.el.className.replace(classTypeNames[binding.arg], "");
    }
  }
}
