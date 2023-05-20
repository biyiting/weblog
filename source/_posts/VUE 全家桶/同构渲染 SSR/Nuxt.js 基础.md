---
title: Nuxt.js 基础
categories:
  - VUE 全家桶
  - 同构渲染 SSR
tags:
  - ssr
  - Nuxt
abbrlink: 745d094f
date: 2021-12-03 08:13:50
---

## Nuxt.js 基础
> Nuxt.js 是一个基于 Vue.js 的服务端渲染应用框架，它可以帮我们轻松的实现同构应用：
>  - 通过对客户端/服务端基础架构的抽象组织，Nuxt.js 主要关注的是应用的 UI渲染；
>  - 目标是创建一个灵活的应用框架，可以基于它初始化新项目的基础结构代码，或者在已有 Node.js 项目中使用 Nuxt.js；
>  - Nuxt.js 预设了利用 Vue.js 开发服务端渲染的应用所需要的各种配置；
>  - 除此之外，还提供了一种命令叫： nuxt generate，为基于 Vue.js 的应用提供生成对应的静态站点的功能，相信这个命令所提供的功能，是向开发集成各种微服务（Microservices）的 Web 应用迈开的新一步。 
>  - 作为框架 Nuxt.js 为客户端/服务端这种典型的应用架构模式提供了许多有用的特性，例如异步数据加载、中间件支持、布局支持等非常实用的功能；
### 特性
1. 基于 Vue.js：Vue、Vue Router、Vuex、Vue SSR；
2. 自动代码分层 
3. 服务端渲染 
4. 强大的路由功能，支持异步数据 
5. 静态文件服务 
6. ES2015+ 语法支持 
7. 打包和压缩 JS 和 CSS 
8. HTML 头部标签管理 
9. 本地开发支持热加载 
10. 集成 ESLint 
11. 支持各种样式预处理器： SASS、LESS、 Stylus 等等 
12. 支持 HTTP/2 

### Nuxt.js 框架是如何运作的？
1. 图示
2. Nuxt.js 集成了以下组件/框架，用于开发完整而强大的 Web 应用： 
    - Vue.js 
    - Vue Router 
    - Vuex 
    - Vue Server Renderer 
3. 压缩并 gzip 后，总代码大小为：57kb （如果使用了 Vuex 特性的话为 60kb）； 
4. 另外 Nuxt.js 使用 Webpack 和 vue-loader 、 babel-loader 来处理代码的自动化构建工作（如打包、代码分层、压缩等等）；

## 创建 Nuxt 项目
### Nuxt.js 的使用方式
1. 第一种：初始化项目；
2. 第二种：已有的 Node.js 服务端项目：直接把 Nuxt 当作一个中间件集成到 Node Web Server 中；
3. 第三种：现有的 Vue.js 项目：非常熟悉 Nuxt.js，至少 10% 的代码改动；

### 手动创建
1. 准备
    ```YAML
    # 创建示例项目 
    mkdir nuxt-app-demo 
    
    # 进入示例项目目录中 
    cd nuxt-app-demo 
    
    # 初始化 package.json 文件 
    npm init -y 
    
    # 安装 nuxt 
    npm innstall nuxt 
    ```
2. 在 package.json 文件的 scripts 中新增
    ```JSON
    "scripts": { 
      "dev": "nuxt" 
    }, 
    ```
3. 创建 pages 目录：`mkdir pages`
4. 创建第一个页面 pages/index.vue
    ```HTML
    <template> 
      <h1>Hello world!</h1> 
    </template>
    ```
5. 然后启动项目： npm run dev 来运行 nuxt；
6. 注意：Nuxt.js 会监听 pages 目录中的文件更改，因此在添加新页面时无需重新启动应用程序

## Nuxt 路由
>Nuxt.js 依据 pages 目录结构自动 encodeURIComponent 生成 vue-router 模块的路由配置
### 基础路由
1. 假设 pages 的目录结构如下
    <img src="基础路由.jpg" width="auto" height="200px" class="custom-img" title="基础路由"/>
2. Nuxt.js 自动生成的路由配置如下
    ```JS
    router: {
      routes: [
        {
          name: 'index',
          path: '/',
          component: 'pages/index.vue'
        }, 
        {
          name: 'user',
          path: '/user',
          component: 'pages/user/index.vue'
        }, 
        {
          name: 'user-one',
          path: '/user/one',
          component: 'pages/user/one.vue'
        }
      ]
    }
    ```
### 路由导航
1. a 标签（会刷新整个页面，不要使用）；
2. nuxt-link 组件；
3. 编程式导航；
### 动态路由
1. 在 Nuxt.js 里面定义带参数的动态路由，需要创建对应的以下划线作为前缀的 Vue 文件 或 目录。 
2. 以下目录结构：
    <img src="动态路由.jpg" width="auto" height="200px" class="custom-img" title="动态路由"/>
3. Nuxt.js 生成对应的路由配置表为：
    ```JS
    router: {
      routes: [
        {
          name: 'index',
          path: '/',
          component: 'pages/index.vue'
        }, 
        {
          name: 'users-id',
          path: '/users/:id?',
          component: 'pages/users/_id.vue'
        }, 
        {
          name: 'slug',
          path: '/:slug',
          component: 'pages/_slug/index.vue'
        }, 
        {
          name: 'slug-comments',
          path: '/:slug/comments',
          component: 'pages/_slug/comments.vue'
        }
      ]
    }
    ```
4. 名称为 users-id 的路由路径带有 :id? 参数，表示该路由是可选的。如果你想将它设置为必选的路由，需要在 users/ 目录内创建一个 index.vue 文件；
### 嵌套路由
1. 可以通过 vue-router 的子路由创建 Nuxt.js 应用的嵌套路由；
2. 创建内嵌子路由，需要添加一个 Vue 文件，同时添加一个与该文件同名的目录用来存放子视图组件；
3. Warning: 别忘了在父组件( .vue 文件) 内增加 <nuxt-child/> 用于显示子视图内容；
4. 假设文件结构如：
    <img src="嵌套路由.jpg" width="auto" height="200px" class="custom-img" title="嵌套路由"/>
5. Nuxt.js 自动生成的路由配置如下：
    ```JS
    router: {
      routes: [
        {
          path: '/users',
          component: 'pages/users.vue',
          children: [
            {
              path: '',
              component: 'pages/users/index.vue',
              name: 'users'
            }, 
            {
              path: ':id',
              component: 'pages/users/_id.vue',
              name: 'users-id'
            }
          ]
        }
      ]
    }
    ```
### [路由配置](https://www.nuxtjs.cn/api/configuration-router)

## Nuxt 视图
>如何在 Nuxt.js 应用中为指定的路由配置数据和视图，包括应用模板、页面、布局和 HTML 头部等内容

<img src="视图.jpg" width="auto" height="300px" class="custom-img" title="视图"/>

### 定制化默认的 html 模板
>只需要在 src 文件夹下（默认是应用根目录）创建一个  app.html 的文件
1. 默认模板为
    <img src="默认模板.jpg" width="auto" height="200px" class="custom-img" title="默认模板"/>
2. 举个例子，可以修改模板添加 IE 的条件表达式：
    <img src="修改模板.jpg" width="auto" height="200px" class="custom-img" title="修改模板"/>

### 布局
1. Nuxt.js 允许扩展默认的布局，或在 layout 目录下创建自定义的布局；
2. 默认布局：
    - 可通过添加 layouts/default.vue 文件来扩展应用的默认布局；
    - 提示: 别忘了在布局文件中添加 <nuxt/> 组件用于显示页面的主体内容；
    - 默认布局的源码如下：
      <img src="默认布局.jpg" width="auto" height="100px" class="custom-img" title="默认布局"/>
3. 自定义布局
    - layouts 目录中的每个文件 (顶级) 都将创建一个可通过页面组件中的 layout 属性访问的自定义布局；
    - 假设要创建一个 博客布局 并将其保存到 layouts/blog.vue:
      <img src="blog.jpg" width="auto" height="200px" class="custom-img" title="blog"/>
    - 然后必须告诉页面 (即 pages/posts.vue) 使用自定义布局：
      <img src="posts.jpg" width="auto" height="300px" class="custom-img" title="posts"/>

### 错误页面
1. 可以通过编辑 layouts/error.vue 文件来定制化错误页面；
2. 警告: 虽然此文件放在 layouts 文件夹中, 但应该将它看作是一个 页面(page)；
3. 这个布局文件不需要包含  <nuxt/>  标签，可以把这个布局文件当成是显示应用错误（404，500 等）的组件；
4. 举一个个性化错误页面的例子 layouts/error.vue:
    <img src="错误页面.jpg" width="auto" height="300px" class="custom-img" title="错误页面"/>

## Nuxt 异步数据
>Nuxt.js 扩展了 Vue.js，增加了一个叫 asyncData 的方法，可以在设置组件的数据之前能异步获取或处理数据

### asyncData 方法
1. 基本用法：
    - 它会将 asyncData 返回的数据融合组件 data 方法返回数据一并给组件；
    - 调用时机：服务端渲染期间和客户端路由更新之前（服务端和客户端都可以使用）；
2. 注意事项：
    - 只能在页面组件中使用（import 引入组件是不会调用 asyncData 方法的）；
    - 没有 this，因为它是在组件初始化之前被调用的；
### 上下文对象 ctx
|属性字段	|类型	|可用	|描述|
|--------|----|----|----|
|app	|Vue 根实例	|客户端 & 服务端	|包含所有插件的 Vue 根实例。例如：在使用 axios 的时候，你想获取 $axios 可以直接通过 context.app.$axios 来获取|
|isClient	|Boolean	|客户端 & 服务端|	是否来自客户端渲染（废弃。请使用 process.client ）|
|isServer	|Boolean	|客户端 & 服务端|	是否来自服务端渲染（废弃。请使用 process.server ）|
|isStatic	|Boolean	|客户端 & 服务端|	是否来自 nuxt generate 静态化（预渲染）（废弃。请使用 process.static ）|
|isDev	|Boolean	|客户端 & 服务端|	是否是开发 dev 模式，在生产环境的数据缓存中用到|
|isHMR	|Boolean	|客户端 & 服务端|	是否是通过模块热替换 webpack hot module replacement (仅在客户端以 dev 模式)|
|route	|Vue Router 路由	|客户端 & 服务端|	Vue Router 路由实例|
|store	|Vuex 数据	|客户端 & 服务端|	Vuex.Store 实例。只有vuex 数据流存在相关配置时可用|
|env	|Object	|客户端 & 服务端|	nuxt.config.js 中配置的环境变量，见 环境变量 api|
|params	|Object	|客户端 & 服务端|	route.params 的别名|
|query	|Object	|客户端 & 服务端|	route.query 的别名|
|req	|http.Request	|服务端	|Node.js API 的 Request 对象。如果 Nuxt 以中间件形式使用的话，这个对象就根据你所使用的框架而定。nuxt generate 不可用|
|res	|http.Response	|服务端|	Node.js API 的 Response 对象。如果 Nuxt 以中间件形式使用的话，这个对象就根据你所使用的框架而定。nuxt generate 不可用|
|redirect	|unction	|客户端 & 服务端|	用这个方法重定向用户请求到另一个路由。状态码在服务端被使用，默认 302 redirect([status,] path [, query])|
|error	|Function	|客户端 & 服务端|	用这个方法展示错误页：error(params) 。params 参数应该包含 statusCode 和 message 字段|
|nuxtState	|Object	|客户端	|Nuxt 状态，在使用 beforeNuxtRender 之前，用于客户端获取 Nuxt 状态，仅在 universal 模式下可用|
|beforeNuxtRender(fn)	|Function	|服务端	|使用此方法更新 \_\_NUXT\_\_ 在客户端呈现的变量，fn 调用 (可以是异步) { Components, nuxtState }|

## Nuxt 路由中间件
>middleware 属性：String 或 Array\<string> 类型

### 在应用中的特定页面设置中间件（前后端都会拦截）
1. pages/secret.vue
    ```HTML
    <template>
      <h1>Secret page</h1>
    </template>
    <script>
      export default {
        // authenticated 就是 middleware 下中间件 js 文件的名字
        // 跳转这个界面前会先执行 authenticated 这个中间件
        middleware: 'authenticated'
      }
    </script>
    ```
2. middleware/authenticated.js
    ```js
    // 中间件必须要放到 middleware 这个文件夹下
    export default function ({ store, redirect }) {
      // 没有权限，直接重定向到登陆界面
      if (!store.state.authenticated) {
        return redirect('/login')
      }
    }
    ```