const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
// 1. 引入 html-webpack-plugin 插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // 入口文件配置，分别打包add.js和mult.js
  entry: {
    pdf: './src/pdf.js',
    img: './src/img.js'
  },
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // 配置UMD格式输出
    library: '[name]',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  // 模块配置
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          // 使用babel-loader处理ES6+语法
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    // 2. 配置并实例化插件
    new HtmlWebpackPlugin({
      // 指定你的源 HTML 模板文件
      // Webpack 会读取这个文件作为基础来生成新的 HTML
      template: './src/index.html', 
      
      // (可选) 指定输出到 dist 目录的文件名，默认为 index.html
      filename: 'index.html', 
      
      // (可选) 配置生成的 HTML 中 <title> 标签的内容
      title: 'My App', 
    }),
  ],
  // 优化配置
  optimization: {
    // 启用代码压缩
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  // 解析配置
  resolve: {
    extensions: ['.js']
  }
};