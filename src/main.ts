import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index";
import { setupStore } from "./stores/index";
import { components } from "@/components/_global"; //全局组件
import { commonEvent } from "@/utils/global"; // 全局事件
import { directives } from "@/directives/index"; // 全局指令
import { plugins } from "@/plugins/index"; //全局插件
import "uno.css";
import "./styles/index.scss";

const app = createApp(App);
app.use(router);
setupStore(app);
components(app);
commonEvent(app);
directives(app);
plugins(app);
app.mount("#app");
