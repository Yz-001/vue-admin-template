import { usePermissionStore } from "@/stores/modules/permission";
import { useUserStore } from "@/stores/modules/user";
import { messageError } from "@/utils/element-utils/notification-common";
import type { Directive } from "vue";
// 自定义指令-菜单权限 v-module:xxx
export const module: Directive = {
  mounted(el, binding) {
    const { modules } = usePermissionStore();
    if (!modules.some(({ id }) => id === binding.arg)) {
      const { disabled } = binding.modifiers;
      if (disabled) {
        el.setAttribute("disabled", "");
        const vei_key = Object.getOwnPropertySymbols(el)?.[0] || "_vei";
        if (el[vei_key].onClick) {
          el[vei_key].onClick.value = () => {
            messageError("暂无权限，请联系管理员添加", "Message");
          };
        }
      } else {
        el.remove();
      }
    }
  }
};

// 自定义指令-功能权限 v-permission:xxx / v-permission="['aaa', 'bbb']"
export const permission: Directive = {
  mounted(el, binding) {
    const { permissions } = usePermissionStore();
    if (binding.arg && !permissions.some(({ id }) => id === binding.arg)) {
      el.remove();
    }
    if (binding.value?.length && !permissions.some(({ id }) => binding.value.includes(id))) {
      el.remove();
    }
  }
};

// 自定义指令-角色权限 v-roles=['xxx','xxx']; 如果不传 则表示只有超管 v-roles
export const roles: Directive = {
  mounted(el, binding) {
    const { value } = binding;
    const super_admin = "superadmin";
    const { roles } = useUserStore();
    const hasRole = roles.some(({ id }) => {
      let hasItem;
      if (value && value instanceof Array && value.length > 0) {
        hasItem = value.includes(id);
      }
      return super_admin === id || hasItem;
    });
    if (!hasRole) {
      el.remove();
    }
  }
};
