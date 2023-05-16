/* eslint-disable @typescript-eslint/no-var-requires */
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { merge } = require('webpack-merge');
const BaseConfig = require('./base.config');
// const _version = new Date().getTime().toString(36);
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ProductionGzipExtensions = ['js'];
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(BaseConfig, {
  mode: 'development',
  cache: true,
  optimization: {
    minimizer: [new TerserPlugin({ parallel: true, extractComments: false })],
    splitChunks: {
      /*
    		all: 对同步 异步 代码都做分割；
    		async: 只对异步代码做分割；
    		initial: 只对同步代码做分割；
    		同步代码：例如 import lodash from 'lodash'
    		异步代码：例如 import ('lodash')
    	*/
      chunks: 'all',
      automaticNameDelimiter: '-', // 模块间的连接符，默认为"~"
      cacheGroups: {
        // 第三方模块
        vendors: {
          name: 'vendor', // 每个组的名字
          priority: 1, // 优先级，越小优先级越高
          // 检测模块是否来自于node_modules,是否通过npm下载的
          test: /[\\/]node_modules[\\/]/,
          // 设置代码分割的最小界限；
          // 可以设置成 5 * 1024 大小 5kb
          // 大于 5kb 的文件才会做分割，也可以设置为 0
          minSize: 5 * 1024,
          minChunks: 1, // 检测模块被引用几次就可以单独打包
        },
        // 公共模块
        common: {
          name: 'common',
          priority: 0,
          minSize: 0,
          minChunks: 2,
          chunks(chunk) {
            // exclude `my-excluded-chunk`
            return ['fault', 'main', 'order', 'subject'].includes(chunk.name);
          },
        },
        default: {
          // 默认设置，可被重写
          minChunks: 2,
          priority: -20,
          // 如果本来已经把代码提取出来，则重用存在的而不是重新产生
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CompressionWebpackPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + ProductionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
});
