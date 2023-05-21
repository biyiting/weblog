---
title: loader 模块加载器
categories:
  - 工程化
  - webpack5
tags:
  - webpack
abbrlink: ef64c3f5
date: 2022-10-11 12:57:34
---
## 模块加载器
1. loader 是 webpack 的核心特性之一：专注实现资源模块加载
    - Webpack 是德国开发者 Tobias Koppers 开发的模块加载器，它能把所有的资源文件 JS、 JSX、 CSS、  Less、 Sass、Image 等都作为模块来使用和处理；
    - 作为一个模块打包工具，主要功能是将打包资源文件整合到一个包中，在开发时，只需要引用一个包文件，就能加载预先设计好的模块功能；
2. 默认 webpack 的 loader 只能打包 JS 文件，如果要打包其他格式的文件，需要安装其他的 loader：
    - css-loader：将 import 引入的 css 代码转化为 JS 代码，并用数组表示，但是没有地方调用这个数组，所以还需要用到 style-loader；
    - style-loader：调用转化成功的 JS 代码，并创建 style 标签，注入到页面中；
    - file-loader: 根据正则表达式匹配到相应的文件后，拷贝一份文件在打包路径的根目录；
    - url-loader：把文件转化为 base64 编码的格式，减少网络请求次数（尽可能的转化小文件，大文件会延长加载时间）（提前要下载好 file-loader，如果超出设置的大小，会采用 file-loader 打包）；
    - html-loader：在入口文件中导入 html 文件需要用到它，并且它可以配置额外的资源加载（例如 a 标签跳转的资源）；
3. loader 配置的执行顺序：从下到上，从右到左；
4. loader 的打包过程：
    - 当 webpack 从入口开始打包的时候，如果引入了非 js 代码，就会去配置文件中的 module 配置项中寻找 loader；
    - 会根据配置项中的 test 正则去匹配改非 js 代码是否满足条件，满足条件则匹配当前的 loader；
    - 然后打包完后将文件名返回引入的地方；
5. loader 的工作原理：
    - loader 负责资源文件从输入到输出的转换；
    - 对一个资源可以依次使用多个 loader；
    - loader 将解析后的结果会追加到 bundle.js 中；
## css 资源加载器
1. 利用 css-loader 来打包 css：
    - 若配置了 style-loader 将打包好的 css 以 style 的方式插入到 html 中；
    - 样式代码中的 @import 指令 和 url 函数：会使用 url-loader 或者 file-load 加载图片；
2. 示例代码：解析 less、scss、css
    ```JS
    const path = require('path');
    module.exports = {
      mode: 'none',
      entry: './src/main.js',
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),  // 输出的绝对路径
        publicPath: 'dist/', // 给资源指定基础路径
      },
      module: {
        rules: [ // loader 执行顺序：从下到上，从后向前
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
          },
          {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
          },
        ],
      },
    };
    ```
3. 效果展示
    <img src="css资源加载器.jpg" width="auto" height="300px" class="custom-img" title="css资源加载器"/>

## 文件资源加载器
1. 利用 file-loader 加载项目中引入的文件资源；
2. 示例代码：
    ```JS
    // webpack.config.js 配置文件
    const path = require('path');
    module.exports = {
      mode: 'none',
      entry: './src/main.js',
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/', // 给资源指定基础路径
      },
      module: {
        rules: [
          {
            test: /\.(png|gif)$/, // 加载以 png、gif 结尾的文件
            use: [
              {
                loader: 'file-loader',
                options: {
                  publicPath: './assets/', // 打包后放到 dist/assets/...
                  // 通过占位符来给文件命名
                  //  [name]：文件原来的名字
                  //  [hash:5]：本次打包的哈希值取前 5 位
                  //  [ext]：文件原来的文件后缀
                  name: '[name].[hash:5].[ext]',
                },
              },
            ],
          },
        ],
      },
    };
    ```

## 处理图片资源
1. 引入图片的方式：
    - 第一种：放在静态文件根目录里，通过 html 中的 image 直接引用，需要配置 `devServer.contentBase` 静态服务；
    - 第二种：通过 require、import 模块方式引入；
    - 第三种：可以在 CSS 中通过 @import 指令 或 url 函数引入图片，css-loader 来进行解析处理，会使用 url-loader 或者 file-load 加载图片；
2. url-loader 和 file-loader：
    - url-loader 是对 file-loader 的增强；
    - 判断图片的大小是否大于 limit：
      - 如果大于的话，就会把工作交给 file-loader 处理；
      - 如果小于的话，就转成 base64 自己处理；
3. 示例代码：
    ```JS
    // webpack.config.js 配置文件
    const path = require("path");
    module.exports = {
      mode: "none",
      entry: "./src/main.js",
      output: {
        filename: "bundle.js",
        path: path.join(__dirname, "dist"),
        publicPath: "dist/", // 给资源指定基础路径
      },
      devServer: {
        contentBase: resolve(__dirname, "static"),
        compress: true, // 是否启动压缩 gzip
        port: 8080, // 指定 HTTP 服务器的端口号
        open: true, // 自动打开浏览器
      },
      module: {
        rules: [
          {
            test: /\.(jpg|png|gif)$/,
            use: [
              {
                loader: "url-loader",
                options: {
                  name: "[hash:10].[ext]",
                  esModule: false,
                  limit: 32 * 1024, // 文件小于 32kb 转成 base64，否则会和 file-loader 做相同操作直接拷贝
                  outputPath: "images", // 指定输出图片的目录
                  publicPath: "/images", // 访问图片的话也需要去 images 目录里找
                },
              },
            ],
          },
          { test: /\.html$/, use: ["html-loader"] }, //  会把 html 中的相对路径转成绝对路径 
        ],
      },
    };
    ```


## 处理 js 代码
1. webpack 只是打包工具，加载器可以用来编译转换代码：
    - babel-loader 使用 Babel 和 webpack 转译 JavaScript 文件；
    - @babel/@babel/coreBabel 编译的核心包；
    - babel-preset-env：babel 默认只转换最新的 ES 语法，而不转换新的 API；
    - @babel/@babel/preset-reactReact 插件的 Babel 预设，转换 jsx；
    - @babel/plugin-proposal-decorators 把类和对象装饰器编译成 ES5；
    - @babel/plugin-proposal-class-properties 转换静态类属性以及使用属性初始值化语法声明的属性；
2. 示例代码：
    ```JS
    // main.js
    const element = document.createElement('h2')

    element.textContent = 'Hello world'
    element.classList.add('heading')
    element.addEventListener('click', () => {
        console.log('Hello webpack')
    })
    document.body.append(element)
    ```
    ```JS
    // webpack.config.js 配置文件
    const path = require("path");
    module.exports = {
      mode: "none",
      entry: "./src/main.js",
      output: {
        filename: "bundle.js",
        path: path.join(__dirname, "dist"),
        publicPath: "dist/", // 给资源指定基础路径
      },
      devServer: {
        contentBase: resolve(__dirname, "static"),
        compress: true, // 是否启动压缩 gzip
        port: 8080, // 指定 HTTP 服务器的端口号
        open: true, // 自动打开浏览器
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/, // 处理 js 或 jsx
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: [
                    [
                      "@babel/preset-env", // 转换 js 语法（es6+ 转成 es5˝）
                      "@babel/preset-react", // 转换 jsx 语法
                    ],
                  ],
                  plugins: [
                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                    ["@babel/plugin-proposal-class-properties", { loose: true }],
                  ],
                  plugins: [
                    ["@babel/plugin-proposal-decorators", { legacy: true }],
                    [
                      "@babel/plugin-proposal-private-property-in-object",
                      { loose: true },
                    ],
                    ["@babel/plugin-proposal-private-methods", { loose: true }],
                    ["@babel/plugin-proposal-class-properties", { loose: true }],
                  ],
                },
              },
            ],
          },
        ],
      },
    };
    ```
    ```JSON
    // jsconfig.json，给 vscode 看的，否则打包报错（js 代码中有装饰器）
    {
      "compilerOptions": {
          "experimentalDecorators": true
      }
    }
    ```
3. Babel 默认只转换新的 Javascript 语法，而不转换新的 API，比如
    - Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，比如说 ES6 在 Array 对象上新增了 Array.find 方法，Babel 就不会转码这个方法，如果想让这个方法运行，必须使用  babel-polyfill 来转换；
    - babel-polyfill：它是通过向全局对象和内置对象的 prototype 上添加方法来实现的；
      - 比如运行环境中不支持 Array.prototype.find 方法，引入 polyfill 就可以使用 es6 方法来编写了，缺点是会造成全局污染；
      - Babel 7.4 之后不再推荐使用 @babel/polyfill，推荐使用 @babel/preset-env 代替以往的诸多 polyfill 方案；
		- @babel/@babel/preset-env 为每一个环境的预设：
		  - useBuiltIns：false，全量引入 @babel/polyfill；
		  - useBuiltIns：entry，根据配置的浏览器兼容，引入浏览器不兼容的 polyfill；需要在入口文件手动添加 import '@babel/polyfill'，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill；需要指定 core-js 的版本, 如果 "corejs": 3, 则 import '@babel/polyfill' 需要改成：
        ```JS
        import 'core-js/stable';
        import 'regenerator-runtime/runtime';
        ```
    - @babel/plugin-transform-runtime：启用插件 @babel/plugin-transform-runtime 后，Babel 就会使用 babel-runtime 下的工具函数；
      - @babel/plugin-transform-runtime 插件能够将这些工具函数的代码转换成 require 语句，指向为对 babel-runtime 的引用；
      - @babel/plugin-transform-runtime 可以在使用新 API 时自动引入 babel-runtime 里面的 polyfill；
        - 当使用 async/await 时，自动引入 babel-runtime/regenerator；
        - 当使用 ES6 的静态事件或内置对象时，自动引入 babel-runtime/core-js；
        - 移除内联 babel helpers 并替换使用 babel-runtime/helpers 来替换；

4. 最佳开发实践
    ```JS
    {
      test: /\.jsx?$/,
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: [
              [
                [
                  "@babel/preset-env", // 转换 js 语法（es6+ 转成 es5˝）
                  {
                    targets: ">0.25%"
                  }
                ],
                "@babel/preset-react", // 转换 jsx 语法
              ],
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 2,//当使用 ES6 静态事件或内置对象时自动引入 babel-runtime/core-js
                  helpers: true, //移除内联 babel helpers 并替换使用 babel-runtime/helpers 来替换
                  regenerator: true, //开启 generator 函数转换成使用 regenerator runtime 避免污染全局作用域
                }
              ]
            ],
          },
        },
      ],
    },
    ```