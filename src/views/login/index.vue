<template>
  <div class="login">
    <div class="login-left">
      <el-image src="src/assets/img/login-bg.webp" />
    </div>
    <div class="login-right">
      <div class="login-right__form">
        <div class="text-center">
          <BaseMark :collapse="false" :isCanClick="false" />
        </div>
        <el-form
          ref="loginFormRef"
          :model="from"
          :hide-required-asterisk="true"
          label-width="120px"
          :rules="rules"
          label-position="top"
        >
          <el-form-item :label="$t('login.Username')" prop="username">
            <el-input v-model="from.username" :placeholder="$t('login.UsernameReg')" :prefix-icon="UserFilled" />
          </el-form-item>
          <el-form-item :label="$t('login.Password')" prop="password">
            <el-input
              v-model="from.password"
              type="password"
              :placeholder="$t('login.PassWordReg')"
              :prefix-icon="Key"
            />
          </el-form-item>
          <p class="login-right__form__oper">
            <el-checkbox v-model="from.exemption" label="一周内免登入" size="large" />
            <el-link :href="accountUrl" :underline="false" target="_blank"> 忘记密码？ </el-link>
          </p>
          <el-button v-loading="submitLoading" type="primary" class="w-full mt-2" @click="handleSubmitLogin">
            {{ $t("menus.Login") }}
          </el-button>
          <a class="login-right__form__sign" :href="accountUrl" :underline="false" target="_blank">
            没有账号？请点击 <span>注册</span>
          </a>
        </el-form>
      </div>
    </div>

    <AppAutoLoginBtn type="autoLogin" btnName="临时免登入" :form="from" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { messageError, messageSuccess } from "@/utils/element-utils/notification-common";
import { encrypt } from "@/utils/cryptoJS";
import { useUserStore } from "@/stores/modules/user";
import { UserResult } from "@/apis/interface/user";
import { setToken } from "@/utils/storage";
import { useEventListener } from "@vueuse/core";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { $t } from "@/plugins/i18n";
import { UserFilled, Key } from "@element-plus/icons-vue";
import BaseMark from "@/layout/component/BaseMark.vue";
import AppAutoLoginBtn from "@/components/AppAutoLoginBtn/index.vue";
let from = reactive<loginForm>({
  username: "",
  password: "",
  exemption: false
});
const rules = reactive<FormRules<loginForm>>({
  username: [{ required: true, message: $t("login.UsernameReg"), trigger: "blur" }],
  password: [{ required: true, message: $t("login.PassWordReg"), trigger: "blur" }]
});
const { t } = useI18n();
const router = useRouter();
const { setUserInfo, loginByUser } = useUserStore();
const loginFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const handleSubmitLogin = async () => {
  submitLoading.value = true;
  await loginFormRef.value?.validate((valid, fields) => {
    if (valid) {
      const apiData = JSON.parse(JSON.stringify(from));
      apiData.password = encrypt(apiData.password);
      loginByUser(apiData)
        .then(async res => {
          const data = res?.data;
          if (data?.token) setToken(data.token, from.exemption ? 7 : undefined);
          await setUserInfo(data as UserResult);
          messageSuccess(t("login.LoginSuccess"));
          router.push({ name: "Home" });
          submitLoading.value = false;
        })
        .catch(_ => {
          submitLoading.value = false;
        });
    } else {
      submitLoading.value = false;
    }
  });
};
useEventListener(document, "keypress", ({ code }) => {
  if (code === "Enter" && !submitLoading.value) {
    handleSubmitLogin();
  }
});
const accountUrl = import.meta.env.VITE_APP_ACCOUNT_FRONTEND_URL;
onMounted(() => {});

interface loginForm {
  username: string;
  password: string;
  exemption: boolean;
}
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  background-size: 100% 100vh;

  &-left {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56%;
    height: 100%;
    color: #fff;
    background-color: #cedff2;

    .el-image {
      width: 100%;
      height: 98%;
      margin-top: 1%;
    }
  }

  &-right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44%;
    height: 100%;

    &__form {
      width: 482px;
      height: 420px;
      padding: 20px 40px;
      color: $--text-color-base;

      &__oper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: $--text-color-regular;
      }

      .el-link,
      .el-checkbox {
        color: $--text-color-base;
      }

      &__sign {
        display: inline-block;
        width: 100%;
        margin-top: 27px;
        text-align: center;
        pointer-events: none;

        span {
          color: var(--el-color-primary);
          pointer-events: auto;
          cursor: pointer;
        }
      }

      .el-form {
        margin-top: 10px;
      }

      :deep(.el-input__inner) {
        height: 50px;
      }

      .el-button {
        height: 50px;
      }
    }
  }
}
</style>
