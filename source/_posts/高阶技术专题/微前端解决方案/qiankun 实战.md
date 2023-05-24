---
title: qiankun 实战
categories:
  - 高阶技术专题
  - 微前端解决方案
tags:
  - 微前端
abbrlink: 73e70c65
date: 2022-04-16 10:12:58
---

## 构建 vue 子应用
1. main.js 入口文件
    ```JS
    import Vue from "vue";
    import App from "./App.vue";
    import router from "./router";
    Vue.config.productionTip = false;
    
    let instance = null;
    function render() {
      instance = new Vue({
        router,
        render: (h) => h(App),
      }).$mount("#app"); // 挂载到自己的 html 中，基座会把挂载后的 html 插入到基座中
    }
    
    if (window.__POWERED_BY_QIANKUN__) { // 动态添加 public path
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
    if (!window.__POWERED_BY_QIANKUN__) { // 独立运行，不作为子应用
      render();
    }
    
    export async function bootstrap(props) {
      // 启动
    }
    export async function mount(props) {
      console.log(props); // 父应用传过来的
      // 挂载
      render();
    }
    export async function unmount(props) {
      // 销毁
      instance.$destroy();
    }
    ```
2. router/index.js
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
      base: '/vue',
      routes
    })
    export default router
    ```
3. vue.config.js
    ```JS
    module.exports = {
      devServer: {
        port: 10000,
        headers: {
          "Access-Control-Allow-Origin": "*", // 跨域
        },
      },
      configureWebpack: {
        output: {
          library: "vueApp",
          libraryTarget: "umd",
        },
      },
    };
    ```
4. <a class="attachment" name="qiankun-vue-child.zip">代码附件下载</a>


## 构建 react 子应用
1. index.js 入口文件
    ```JS
    import React from "react";
    import ReactDOM from "react-dom";
    import "./index.css";
    import App from "./App";
    
    function render() {
      ReactDOM.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>,
        document.getElementById("root")
      );
    }
    if (!window.__POWERED_BY_QIANKUN__) { // 独立运行
      render();
    }
    
    export async function bootstrap() {
      // 启动
    }
    export async function mount() {
      // 挂载
      render();
    }
    export async function unmount() {
      // 销毁
      ReactDOM.unmountComponentAtNode(document.getElementById("root"));
    }
    ```
2. .env 环境变量
    ```bash
    PORT=20000
    WDS_SOCKET_PORT=20000
    ```
3. config-overrides.js 重写配置文件
    ```JS
    // 通过 react-app-rewired 插件重写配置（yarn add react-app-rewired --save-dev）
    module.exports = {
      webpack: (config) => {
        config.output.library = `reactApp`;
        config.output.libraryTarget = "umd";
        config.output.publicPath = "http://localhost:20000/";
        return config;
      },
      devServer: function (configFunction) {
        return function (proxy, allowedHost) {
          const config = configFunction(proxy, allowedHost);
          config.headers = {
            "Access-Control-Allow-Origin": "*",
          };
          return config;
        };
      },
    };
    ```
4. <a class="attachment" name="qiankun-react-child.zip">代码附件下载</a>

## 构建 base 基座（vue 父应用）
1. main.js 入口文件
    ```JS
    import Vue from "vue";
    import App from "./App.vue";
    import router from "./router";
    import ElementUI from "element-ui";
    import "element-ui/lib/theme-chalk/index.css";
    import { registerMicroApps, start } from "qiankun";
    Vue.use(ElementUI);
    Vue.config.productionTip = false;
    
    // 注册子应用（子应用必须支持跨域）
    const apps = [
      {
        name: "vueApp", // 引用名字
        entry: "http://localhost:10000",  // 默认加载这个 html 解析里面的 js，动态执行
        container: "#vue", // 挂载节点 id
        activeRule: "/vue", // 激活的路径
        props: {
          // 自定义属性 传递给 vue 子应用
          a: 1,
          b: 2,
        },
      },
      {
        name: "reactApp",
        entry: "http://localhost:20000",  // 默认加载这个 html 解析里面的 js，动态执行
        container: "#react",
        activeRule: "/react",
      },
    ];
    registerMicroApps(apps);
    start();
    
    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
    ```
2. App.vue
    ```HTML
    <template>
      <div>
        <el-menu :router="true" mode="horizontal">
          <!-- 基座自己的路由 -->
          <el-menu-item index="/">首页</el-menu-item>
          <!-- 基座 vue 子应用 -->
          <el-menu-item index="/vue">vue应用</el-menu-item>
          <!-- 基座 react 子应用 -->
          <el-menu-item index="/react">react应用</el-menu-item>
        </el-menu>
        <router-view v-show="$route.name"></router-view>
        <div v-show="!$route.name" id="vue"></div>
        <div v-show="!$route.name" id="react"></div>
      </div>
    </template>
    ```
3. <a class="attachment" name="qiankun-base.zip">代码附件下载</a>

## 效果展示
<img src="效果展示.jpg" width="700px" height="auto" class="lazy-load" title="效果展示"/>
