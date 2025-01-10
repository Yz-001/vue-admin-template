<script setup lang="ts">
const prop = withDefaults(
  defineProps<{
    type?: string; // 填充类型 对应USER_FROM_MAP
    form?: any; // 表单
    bottom?: string; // 偏移量bottom位置
    right?: string; // 偏移量right位置
  }>(),
  {
    type: "adm",
    form: {
      username: "",
      password: ""
    },
    bottom: "20px",
    right: "20px"
  }
);

const USER_FROM_MAP = {
  adm: {
    username: "xxx",
    password: "xxx"
  }
};

const emit = defineEmits(["update:from", "default:load"]);
const handleUseDefalutUser = () => {
  // emit("update:from", USER_FROM_MAP[prop?.type]);
};
</script>

<template>
  <div class="auto-login-btn" :style="{ bottom, right }">
    <el-button type="primary" class="mt-2" @click="handleUseDefalutUser">启用默认账号</el-button>
  </div>
</template>

<style scoped>
.auto-login-btn {
  position: fixed;
  z-index: 9999;
  width: 200px;
  height: 80px;
  color: #fff;
}
</style>
