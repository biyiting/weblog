---
title: plugins 插件机制
categories:
  - 工程化
  - webpack5
tags:
  - webpack
abbrlink: aae94268
date: 2022-10-15 18:23:34
---

## 插件机制

1. 插件是 webpack 的另一个核心特性：增强 webpack 自动化能力；
2. 插件机制：
    - 解决「除了资源加载以外的」其他自动化工作；
    - webpack + plugin 完成了大部分的前端工程化，所以又很多人误解 webpack 就是工程化；
3. 工作原理：
    - 相比于 loadr，Plugin 拥有更宽的能力范围；
    - Plugin 通过钩子机制实现，通过在生命周期的钩子中挂载函数实现扩展；
    - 一个函数或者是一个包含 apply 方法的对象；
    <img src="工作原理.jpg" width="auto" height="200px" class="lazy-load" title="工作原理"/>
4. 自动化工作都有哪些：
    - 清除 dist 目录；
    - 拷贝静态文件至输出目录（不需要被打包）；
    - 压缩输出代码；
    - ......

## clean-webpack-plugin
1. clean-webpack-plugin：打包前自动清理输出目录的打包文件；
2. 示例代码：webpack.config.js
    ```JS
    const path = require('path')
	
    // 引入插件
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    
    module.exports = {
      mode: 'none',
      entry: './src/main.js',
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: 'dist/'
      },
      module: {
        rules: [
          {
            test: /.png$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024 // 10 KB
              }
            }
          }
        ]
      },
      // plugins 数组里面放插件
      plugins: [
        new CleanWebpackPlugin()
      ]
    }
    ```

## html-webpack-plugin
1. html-webpack-plugin：打包结束后自动生成 html 的插件，并自动引入 bundle.js；

2. 示例代码：webpack.config.js
    ```JS
    const path = require('path')
	
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    
    module.exports = {
      mode: 'none',
      entry: './src/main.js',
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
      },
      module: {
        rules: [
          {
            test: /.png$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 10 * 1024 // 10 KB
              }
            }
          }
        ]
      },
      plugins: [
        new CleanWebpackPlugin(),
    
        // 用于生成 index.html
        new HtmlWebpackPlugin({
          // html 标题
          title: 'Webpack Plugin Sample',
          meta: {
            viewport: 'width=device-width'
          },
          // 大量自定义的内容，使用模版
          template: './src/index.html'
        }),
    
        // 用于生成 about.html
        new HtmlWebpackPlugin({
          filename: 'about.html'
        })
      ]
    }
    ```

## copy-webpack-plugin
1. copy-webpack-plugin：拷贝不需要构建的静态文件到打包后的文件夹中；
	
2. 示例代码：webpack.config.js
    ```JS
    const path = require('path')
	
    const { CleanWebpackPlugin } = require('clean-webpack-plugin')
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    
    module.exports = {
        mode: 'none',
        entry: './src/main.js',
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'dist'),
        },
        module: {
            rules: [{
                test: /.png$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10 * 1024 // 10 KB
                    }
                }
            }]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(__dirname, '/public'),
                    to: path.resolve(__dirname, '/dist/static/')
                }, 
            ])
        ]
    }
    ```