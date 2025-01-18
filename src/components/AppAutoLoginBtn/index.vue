<script setup lang="ts">
import { useRouter } from "vue-router";
import { setToken } from "@/utils/storage";
import { useUserStore } from "@/stores/modules/user";
import { type UserResult } from "@/apis/interface/user";

const prop = withDefaults(
  defineProps<{
    type?: string; // 填充类型 对应USER_FROM_MAP
    form?: any; // 表单
    btnName?: string;
    top?: string; // 偏移量bottom位置
    bottom?: string; // 偏移量bottom位置
    right?: string; // 偏移量right位置
  }>(),
  {
    type: "adm",
    form: {
      username: "",
      password: ""
    },
    btnName: "启用默认账号",
    top: "100px",
    bottom: "0",
    right: "0"
  }
);

const USER_FROM_MAP: { [key: string]: { username: string; password: string } | undefined } = {
  adm: {
    username: "admin",
    password: "123456"
  },
  autoLogin: {
    username: "autologin",
    password: "123456"
  }
};

const emit = defineEmits(["update:from", "default:load"]);
const router = useRouter();
const { setUserInfo } = useUserStore();
const handleUseDefalutUser = () => {
  if (prop?.type == "autoLogin") {
    setToken("autologin", 7);
    setUserInfo({ username: "临时用户" } as UserResult);
    router.push("/");
  } else {
    emit("update:from", USER_FROM_MAP[prop?.type]);
  }
};
</script>

<template>
  <div class="auto-login-btn" :style="{ top, bottom, right }">
    <el-button type="primary" class="mt-2" @click="handleUseDefalutUser">{{ btnName }}</el-button>
  </div>
</template>

<style scoped>
.auto-login-btn {
  position: fixed;
  z-index: 9999;
  color: #fff;
}
</style>
