export const ElSelectLoadMore = {
  mounted(
    el: { _selectDom: any; _selectLoadMore: () => void },
    binding: { value: () => any },
    vnode: {
      children: { component: { refs: { popperRef: { contentRef: { querySelector: (arg0: string) => any } } } } }[];
    }
  ) {
    const selectDom = vnode.children[0].component.refs.popperRef.contentRef.querySelector(
      ".el-select-dropdown .el-select-dropdown__wrap"
    );
    function loadMores(this: any) {
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
  beforeUnmount(el: { _selectLoadMore: any; _selectDom?: { removeEventListener: (arg0: string, arg1: any) => void } }) {
    if (el._selectLoadMore) {
      if (el._selectDom) el._selectDom.removeEventListener("scroll", el._selectLoadMore);
      delete el._selectDom;
      delete el._selectLoadMore;
    }
  }
};
