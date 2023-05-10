## 长度单位自动转换说明

---

> 本项目使用`postcss-pxtorem`将样式声明中的长度单位统一转换为`rem`单位

1. `postcss-pxtorem`配置在`postcss.config.js`中
2. `main.js`中引入`rem.js`,在项目开始时设置`rem`大小
3. 长度声明的单位仍需保留`px`单位的话可以大写（`Px`或者`PX`）
   > 但注意，本项目同时使用`Prettier`进行代码格式化，会自动将大写转为小写，使用时需要显示声明`/* prettier-ignore */`屏蔽`Prettier`对下一行的格式化，或者在`scss`中使用`#{"1PX"}`

## DEV 开发模式说明

---

> Q&A 问题来源: 本地启动 dev-server 访问 js 路径问题

> 本地启动 dev-server 完成后，单独访问非 index.html 时 服务地址请按照 http://localhost:8888/[entryName].html 进行访问。具体配置请查看 <b>webpack/base.config.js</b>中 **entry** htmlwebpackplugin 的设置

## git 提交规范

- feat: 新功能（feature）
- fix/to: 修复 Bug （要记录 Bug 单号）
- docs: 文档（documentation）
- style: 样式（记录修复的模块）
- refactor: 重构 （记录重构的功能模块）
- perf: 优化相关
- test: 测试相关
- chore: 构建工具或辅助工具变动（变动的部分）
- revert: 回滚到上一个版本 （记录从哪个版本回滚到哪一个）
- merge: 代码合并 （合并分支）
- sync: 同步主线或者分支的 bug

## 使用 [JSON-Server](https://www.npmjs.com/package/json-server)

1. > npm i json-server -g 一定要安装全局；
2. > 在启动 npm run json 前 在根目录下新建 mock 文件夹和建一个 db.json（如果有了则可以添加自己的接口资源）；
3. > 在请求 资源时： 需要根据当前的 process.env.NODE_ENV === development 进行资料路径设置；
4. > 请求的路径配置跨越问题：在 webpack 文件夹下的 dev.config.js 中 proxy 配置 json-server 的端口和拦截参数；
5. > 参考 src/api/engine.ts 下的配置；

## 运行说明

1. > npm i 安装
2. > npm run serve 运行
3. > npm run build 打包

## 打包优化方案

> 使用 cache 1. babel-loader 加入 cache 参数 2. 使用 hard-source-webpack-plugin 3.
