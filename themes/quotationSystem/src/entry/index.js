import { createApp } from "vue";
import store from "@/store";
import App from "@/App";
import router from "@/router/index";
import ElementPlus from "element-plus";
import ElementLocale from "element-plus/lib/locale/lang/zh-cn";
import "nprogress/nprogress.css";
import "@/css/element-style-main.scss";
import "@/css/common.scss";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(ElementPlus, { locale: ElementLocale });
app.mount("#app");
