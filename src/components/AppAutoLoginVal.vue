<template>
  <div class="auto-login-val" :style="{ bottom, right }">
    <!-- <el-button v-if="!isSerialNum && !$isProdMode()" type="primary" class="mt-2"
      @click="handleUseDefalutUser">启用默认账号</el-button> -->
  </div>
</template>

<script setup lang="ts">
const prop = withDefaults(
  defineProps<{
    form?: any;
    isSerialNum?: boolean;
    type?: string;
    bottom?: string;
    right?: string;
  }>(),
  {
    form: {
      username: "",
      password: ""
    },
    type: "adm",
    bottom: "20px",
    right: "20px",
    isSerialNum: false
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
  emit("update:from", USER_FROM_MAP[prop.type]);
};
</script>

<style scoped>
.auto-login-val {
  position: fixed;
  z-index: 9999;
  width: 200px;
  height: 80px;
  color: #fff;
}
</style>
