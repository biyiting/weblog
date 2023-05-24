---
title: Single-SPA 实战
categories:
  - 高阶技术专题
  - 微前端解决方案
tags:
  - 微前端
abbrlink: 65ae085f
date: 2022-04-16 09:47:58
---
## 构建子应用（vue）
1. main.js 入口文件
    ```JS
    import Vue from "vue";
    import App from "./App.vue";
    import router from "./router";
    import singleSpaVue from "single-spa-vue";
    Vue.config.productionTip = false;
    
    const appOptions = {
      el: "#vue", // 挂载到父应用的 #vue 上
      router,
      render: (h) => h(App),
    };
    
    if (window.singleSpaNavigate) { // 被父应用引用
      // 动态设置子应用 publicPath
      // 设置绝对路径，这样就不会自动获取浏览器的 host+ip 去发请求了
      __webpack_public_path__ = "http://localhost:10000/";
    } else { // 子应用独立运行
      delete appOptions.el;
      new Vue(appOptions).$mount("#app");
    }
    
    const vueLifeCycle = singleSpaVue({ Vue, appOptions });
    
    // 协议接入：定好了协议，父应用调用
    // 子应用必须导出 以下生命周期 bootstrap、mount、unmount
    export const bootstrap = vueLifeCycle.bootstrap;
    export const mount = vueLifeCycle.mount;
    export const unmount = vueLifeCycle.unmount;
    export default vueLifeCycle;
    // 将子应用打包成 lib 给父应用使用
    ```
2. router.js 路由配置
    ```JS
    import Vue from 'vue'
    import VueRouter from 'vue-router'
    import HomeView from '../views/HomeView.vue'
    Vue.use(VueRouter)
    
    const routes = [
      {
        path: '/',
        name: 'home',
        component: HomeView
      },
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
      }
    ]
    const router = new VueRouter({
      mode: 'history',
      base: '/vue', // 设置路由的基础路径
      routes
    })
    export default router
    ```
3. vue.onfig.js 配置库打包
    ```JS
    // 自定义打包方式
    module.exports = {
      configureWebpack: {
        output: {
          library: "singleVue", // 打包成类库，指定名字
          libraryTarget: "umd", // 指定打包模块类型
        },
        devServer: {
          // 配置开发服务
          port: 10000,
        },
      },
    };
    // 打包成 umd 模块的特点，会把 bootstrap、mount、unmount 挂载到全局上
    // window.singleVue.bootstrap
    // window.singleVue.mount
    // window.singleVue.unmount
    ```
4. 效果展示：单独启动项目
    <img src="单独启动项目.jpg" width="600px" height="auto" class="lazy-load" title="单独启动项目"/>
5. <a class="attachment" name="child-vue.zip">代码附件下载</a>

## 构建父应用（vue）
1. main.js 入口文件
    ```JS
    import Vue from "vue";
    import App from "./App.vue";
    import router from "./router";
    import { registerApplication, start } from "single-spa";
    import ElementUI from "element-ui";
    import "element-ui/lib/theme-chalk/index.css";
    Vue.use(ElementUI);
    
    // 加载 js 脚本，插入到 html 的 head 后
    const loadScript = async (url) => {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };
    
    // 注册子应用：registerApplication 第二个参数必须是 promise 函数
    registerApplication(
      "singleVue",
      async () => {
        // 加载子应用：需要手动加载
        await loadScript("http://localhost:10000/js/chunk-vendors.js");
        await loadScript("http://localhost:10000/js/app.js");
        return window.singleVue;
      },
      (location) => location.pathname.startsWith("/vue") // 拦截 /vue，加载子应用
    );
    start();
    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
    ```
2. app.vue 入口组件
    ```HTML
    <template>
      <div id="nav">
        <!-- /vue => 加载子应用 -->
        <router-link to="/vue">vue项目</router-link>
        <!-- 子应用加载的位置 -->
        <div id="vue"></div>
      </div>
    </template>
    ```
3. 效果展示：启动微模块
    <img src="启动微模块.jpg" width="600px" height="auto" class="lazy-load" title="启动微模块"/>
4. <a class="attachment" name="parent-vue.zip">代码附件下载</a>


## Single-SPA 的缺陷
1. 不够灵活，不能动态加载 js 文件；
2. 没有样式隔离；
3. 没有 js 沙箱机制；


