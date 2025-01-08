import { filterHiddenRoutes } from "@/utils/layout";
import { usePermissionStore } from "@/stores/modules/permission";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { computed } from "vue";
export default function useMenu() {
  const permissionStore = usePermissionStore();
  const menuList = computed(() => {
    return permissionStore.$state.menuList || [];
  });
  const setMenuList = async (routes: RouteLocationNormalizedLoaded) => {
    let list = await filterHiddenRoutes(routes);
    // 单独处理Home
    list = list.map(i => {
      if (i.path == "") {
        return i.children.find(c => c.name == "Home");
      } else {
        return i;
      }
    });
    permissionStore.SET_MENULIST(list);
  };

  return {
    menuList,
    setMenuList
  };
}
