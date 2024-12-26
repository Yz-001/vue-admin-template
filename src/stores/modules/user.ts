import { getUserInfoApi, postUserLoginApi } from "@/apis/user";
import type { UserResult } from "@/apis/interface/user";
import router from "@/router";
import { getToken, removeToken, setToken } from "@/utils/storage";
import { messageError } from "@/utils/element-utils/notification-common";
import { defineStore } from "pinia";
import { useSettingsStore } from "@/stores/modules/settings";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      avatar: "",
      username: "",
      roles: [] as Array<{ id: string }>,
      tenantId: "",
      userInfoSet: { userId: "" }
    };
  },
  actions: {
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    SET_USERNAME(username: string) {
      this.username = username;
    },
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登入 */
    async loginByUser(data) {
      return new Promise((resolve, reject) => {
        postUserLoginApi(data)
          .then(data => {
            setToken(String(data.data));
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    getUserInfo() {
      getUserInfoApi({ token: getToken() })
        .then(data => {
          this.setUserInfo(data);
        })
        .catch(error => {
          if (error?.message) messageError(error.message);
        });
    },
    setUserInfo(data: UserResult) {
      this.userInfoSet = data || {};
      this.avatar = data?.avatar || "";
      this.username = data?.username || "";
      this.roles = data?.roles || "";
      this.tenantId = data?.tenantId || "";
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.username = "";
      this.roles = [];
      const { CLEAR_TABS } = useSettingsStore();
      CLEAR_TABS();
      removeToken();
      router.push("/login");
    }
  }
});
