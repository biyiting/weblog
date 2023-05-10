/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const BaseConfig = require('./base.config');
const fs = require('fs');
const path = require('path');

let mock = require('../mock/index.js');

const SELF_PROXY_PATH = '../self-proxy.js';
let proxy = {};

let selfProxyEnableFlag = false;
if (fs.existsSync(path.resolve(__dirname, SELF_PROXY_PATH))) {
  const selfProxy = require(SELF_PROXY_PATH);
  proxy = selfProxy;
  selfProxyEnableFlag = true;
  console.log('self-proxy:');
  console.log(proxy);
}

module.exports = merge(BaseConfig, {
  mode: 'development',
  devServer: {
    publicPath: '/',
    port: 8888,
    host: '0.0.0.0',
    stats: {
      assets: false,
      builtAt: true,
      chunks: true,
      colors: true,
      error: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
    proxy,
    before: mock, // 自己手动实现：假数据接口
  },
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [
          selfProxyEnableFlag ? 'self-proxy配置生效' : '',
          'Project is running at http://localhost:8888/',
          // ...dependenciesVersion.split('\n'),
        ].filter(v => v),
      },
    }),
  ],
});
