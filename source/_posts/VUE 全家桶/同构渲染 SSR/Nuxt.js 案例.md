---
title: Nuxt.js 案例
categories:
  - VUE 全家桶
  - 同构渲染 SSR
tags:
  - ssr
  - Nuxt
abbrlink: ee342463
date: 2021-12-03 14:37:50
---

## Nust.js 概览
1. 介绍 
    - [GitHub仓库](https://github.com/gothinkster/realworld)
    - [在线示例](https://demo.realworld.io/#/)
    - [接口文档](https://github.com/gothinkster/realworld/tree/master/api)
    - 页面模板 
2. 收获：
    - 掌握使用 Nuxt.js 开发同构渲染应用；
    - 增强 Vue.js 实践能力；
    - 掌握同构渲染应用中常见的功能处理：
      - 用户状态管理；
      - 页面访问权限处理；
      - SEO 优化；
      - ......
    - 掌握同构渲染应用的发布与部署；
3. <a class="attachment" name="realworld-nuxtjs.zip">代码附件下载</a>

## 跨域身份验证 (JWT)
1. 由于服务端渲染，登陆之后存储的 cookie 服务端也需要使用，服务端和客户端需要共享 Cookie；
2. 实现代码
    - login.vue
      ```HTML
      <template>
        <div class="container">
          <h1>Sign in to access the secret page</h1>
          <div>
            <label for="email">
              <input id="email" type="email" value="test" />
            </label>
            <label for="password">
              <input id="password" type="password" value="test" />
            </label>
            <button @click="postLogin">login</button>
          </div>
        </div>
      </template>
      <script>
      // 由于是同构渲染，这个插件只支持客户端使用，需要做一下判断
      const Cookie = process.client ? require('js-cookie') : undefined;
      export default {
        // 跳转这个界面前会先执行 notAuthenticated 这个中间件
        middleware: 'notAuthenticated',
        methods: {
          postLogin() {
            // 模拟登陆成功返回的数据
            setTimeout(() => {
              const auth = { accessToken: 'someStringGotFromApiServiceWithAjax' };
              // 存储到容器是为了方便共享
              this.$store.commit('setAuth', auth);
              // 把登陆状态存储到 Cookie 中，持久化（前后端都能获取，共享）
              Cookie.set('auth', auth);
              this.$router.push('/');
            }, 1000);
          },
        },
      };
      </script>
      ```
    - store/index.js
      ```JS
      // 判断是服务器，导入 cookieparser
      const cookieparser = process.server ? require('cookieparser') : undefined
      
      // 在服务端渲染期间运行都是同一个实例，这是不合理的
      // 为了防止数据冲突，务必要把 state 定义成一个函数，返回数据对象
      export const state = () => {
        return {
          // 当前登录用户的登录状态
          auth: null
        }
      }
      
      export const mutations = {
        setAuth(state, auth) {
          state.auth = auth
        }
      }
      
      export const actions = {
        // 服务端渲染的时候会自动调用这个方法
        // 初始化容器以及需要传递给客户端的数据
        // 这个特殊的 action 只在服务端渲染期间运行
        nuxtServerInit({ commit }, { req }) {
          let auth = null
      
          if (req.headers.cookie) {
            const parsed = cookieparser.parse(req.headers.cookie)
            try {
              auth = JSON.parse(parsed.auth)
            } catch (err) {
              // No valid cookie found
            }
          }
      
          // 修改 mutations 状态
          commit('setAuth', auth)
        }
      }
      ```
    - middleware/notAuthenticated.js（路由中间件）
      ```JS
      // 页面访问权限中间件
      export default function ({ store, redirect }) {
        if (store.state.user) {
          return redirect('/')
        }
      }
      ```

## 统一设置用户 token
1. 插件
    - Nuxt.js 允许在运行 Vue.js 应用程序之前执行 js 插件，这在需要使用自己的库或第三方模块时特别有用；
    - 需要注意的是，在任何 Vue 组件的生命周期内， 只有  beforeCreate  和  created  这两个方法会在 客户端和服务端被调用，其他生命周期函数仅在客户端被调用；
2. 利用 axios 插件，实现统一设置用户 token
    - 首先增加文件 plugins/request.js
    - 然后, 在  nuxt.config.js  内配置  plugins  如下：
      ```JS
      import axios from 'axios'
		
      // 创建请求对象
      export const request = axios.create({
        baseURL: 'https://conduit.productionready.io'
      })
      
      // 通过插件机制获取到上下文对象（query、params、req、res、app、store...）
      // 插件导出函数必须作为 default 成员
      export default ({ store }) => {
        // 任何请求都要经过请求拦截器
        // 可以在请求拦截器中做一些公共的业务处理，例如统一设置 token
        request.interceptors.request.use(function (config) {
          const { user } = store.state
          if (user && user.token) {
            config.headers.Authorization = `Token ${user.token}`
          }
          // 返回 config 请求配置对象
          return config
        }, function (error) {
          // 如果请求失败(此时请求还没有发出去)就会进入这里
          return Promise.reject(error)
        })
      }
      ```
    - 引入 plugins 中 axios 之后调用 axios 时，会在请求头自动放入 token；
      ```JS
      module.exports = {
        plugins: ['~/plugins/request.js']
      }
      ```

## 设置页面 meta 优化 SEO
1. Nuxt.js 使用了  vue-meta  的 head 方法更新应用的 头部标签 Head  和  html 属性；
2. 使用 head 方法设置当前页面的头部标签
    >在 head 方法里可通过  this 关键字来获取组件的数据，可以利用页面组件的数据来设置个性化的 meta 标签；
    ```HTML
    <template>
      <h1>{{ title }}</h1>
    </template>
    <script>
    export default {
      data() {
        return {
          title: 'Hello World!',
        };
      },
      head() {
        return {
          title: this.title,
          meta: [
            {
              hid: 'description',
              name: 'description',
              content: 'My custom description',
            },
          ],
        };
      },
    };
    </script>
    ```
3. 注意：为了避免子组件中的 meta 标签不能正确覆盖父组件中相同的标签而产生重复的现象，建议利用  hid 键为 meta 标签配一个唯一的标识编号；

## 发布部署
1. Nuxt.js 提供了一系列常用的命令, 用于开发或发布部署；
    |命令 	|描述 |
    |------|-----|
    |nuxt |	启动一个热加载的 Web 服务器（开发模式） localhost:3000|
    |nuxt build  	|利用 webpack 编译应用，压缩 JS 和 CSS 资源（发布用）|
    |nuxt start 	|以生产模式启动一个 Web 服务器 (需要先执行 nuxt build ) |
    |nuxt generate |	编译应用，并依据路由配置生成对应的 HTML 文件 (用于静态站点的部署) |
2. 如果使用了 Koa/Express 等 Node.js Web 开发框架，并使用了 Nuxt 作为中间件，可以自定义 Web 服务器的启动入口：
    |命令 |	描述 |
    |------|-----|
    |NODE_ENV=development nodemon server/index.js |	启动一个热加载的自定义 Web 服务器 (开发模式)|
    |NODE_ENV=production node server/index.js |	以生产模式启动一个自定义 Web 服务器(需要先执行 nuxt build)|
3. 可以将这些命令添加至 package.json：
    ```JSON
    "scripts": {
      "dev": "nuxt",
      "build": "nuxt build",
      "start": "nuxt start",
      "generate": "nuxt generate"
    }
    ```

## 渲染模式
1. 渲染模式的选择
    - 如果有 SEO、首屏渲染性能有需求（大多数情况下都是出于 SEO 的需求）：服务端渲染模式，性能其次
    - 如果不需要 SSR 模式了，也可以变成一个普通的纯客户端渲染的 Vue.js 应用（首屏慢）；
    - 如果没啥动态数据，或对动态数据的实时性要求不高，可以使用静态网站生成模式（性能最高）；
    - 服务端渲染（默认）；
2. 客户端渲染
    - 修改配置文件
      ```JS
      export default {
        ssr: false
      }
      ```
    - 构建命令 `npm run build`
3. 静态网站（预渲染）
    - 所谓的静态网站其实就是提前把相关内容生成纯 html 文件，NuxtJS 也可以像 Gridsome、Next 等工具一样生成纯静态网站；
      - 如果网站中动态数据较多，则应该使用服务端渲染或者客户端渲染模式；
      - 如果网站中没什么动态数据，或者对数据的实时性要求不高，那么可以使用这个模式，或者网站根本就不需要动态数据，那就直接纯静态网站，速度极快；
    - 修改配置文件：
      ```JS
      export default {
        ssr: false,
        target: 'static'
      }
      ```
    - 构建命令 `npm run generate`