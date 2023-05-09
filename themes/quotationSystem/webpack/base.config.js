/* eslint-disable @typescript-eslint/no-var-requires */
// const webpack = require('webpack');
const { merge } = require("webpack-merge");
const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge({
  entry: {
    main: "./src/entry/index.js",
  },
  output: {
    publicPath: "./",
    filename: "[name].[contenthash].js",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
      // Vue: "vue",
    },
    extensions: [".js", ".ts", ".tsx", ".vue"],
    // 如果确认需要 node polyfill, 设置 resolve.fallback 安装对应依赖
    fallback: {
      buffer: require.resolve("buffer/"),
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: "vue-loader",
        options: {
          loaders: {
            ts: "ts-loader",
            tsx: "babel-loader!ts-loader",
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsSuffixTo: ["\\.vue$"],
            },
          },
        ],
      },
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              appendTsxSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          "vue-style-loader",
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|mp4|jpe?g|svg|ico|webm)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              publicPath: "./",
              name: "assets/[name].[hash:5].[ext]",
              limit: 200,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              publicPath: "./",
              name: "assets/[name].[hash:5].[ext]",
              limit: 200,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      publicPath: "./",
      template: "src/index.html",
      chunks: "main",
      favicon: path.resolve("./favicon.ico"),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "..", "static/svg"),
          to: "images/svg",
        },
        // {
        //   from: path.resolve(__dirname, '..', 'static/js'),
        //   to: 'js',
        // },
      ],
    }),
  ],
});
