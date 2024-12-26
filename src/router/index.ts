import { router } from "./router";
import { useTitle } from "@vueuse/core";
import { useHttpCancel } from "@/stores/modules/httpCancel";
import type { RouteRecordName } from "vue-router";
import NProgress from "@/utils/progress";
import { getToken } from "@/utils/storage";
import { useUserStore } from "@/stores/modules/user";
import { $t } from "@/plugins/i18n";
import packageJson from "../../package.json";

const WhiteRouteName: RouteRecordName[] = [];
router.beforeEach((to, from, next: any) => {
  // 设置动态标题
  useTitle(`${$t(String(to.meta.title)) ? $t(String(to.meta.title)) + " | " : ""}${packageJson.name}`);

  // 路由切换  去除上一个页面请求未请求完的
  if (to.name !== from.name) {
    const httpCancel = useHttpCancel();
    httpCancel.clearAllHttpPromiseCancel();
  }

  NProgress.start();
  if (to.name === "Login") {
    next();
  } else if (to?.name && WhiteRouteName?.includes(to.name)) {
    next();
  } else {
    // 业务登入逻辑
    if (getToken()) {
      const { userInfoSet, getUserInfo } = useUserStore();
      if (!userInfoSet?.userId) {
        getUserInfo();
      }
      next();
    } else {
      next(`/login?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
