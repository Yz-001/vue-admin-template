export const ElSelectLoadMore = {
  mounted(el, binding, vnode) {
    const selectDom = vnode.children[0].component.refs.popperRef.contentRef.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    function loadMores() {
      // 判断是否到底
      const isBottom = this.scrollHeight - this.scrollTop <= this.clientHeight;
      if (isBottom) {
        // 执行事件回调
        binding.value && binding.value();
      }
    }
    // 将获取到的dom和函数挂载到el-select上，以便实例销毁时进行事件移除处理
    el._selectDom = selectDom;
    el._selectLoadMore = loadMores;
    // 监听滚动事件
    selectDom?.addEventListener("scroll", loadMores.bind(selectDom));
  },
  // 实例销毁
  beforeUnmount(el) {
    if (el._selectLoadMore) {
      el._selectDom.removeEventListener("scroll", el._selectLoadMore);
      delete el._selectDom;
      delete el._selectLoadMore;
    }
  }
};
