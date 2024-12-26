<template>
  <div class="error">
    <router-link to="/home" class="error-back"> 返回首页 </router-link>
    <p class="error-num">404</p>
    <img :src="EmptySmall" alt="error" />
    <p>
      对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容!
    </p>
  </div>
</template>

<script setup lang="ts">
import EmptySmall from "@/assets/img/empty-small.png";
</script>

<style lang="scss" scoped>
.error {
  width: 100%;
  height: 100%;
  margin: 9% auto;
  font-size: 16px;
  font-weight: bold;
  line-height: 60px;
  color: #999;
  text-align: center;

  &-back {
    display: inline-block;
    font-size: 24px;
  }

  &-num {
    margin-bottom: 20px;
    font-size: 25px;
    color: #000;
  }
}
</style>
