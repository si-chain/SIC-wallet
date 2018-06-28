'use strict'
var fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
var dllConfig = require('../config/dll')
const vueLoaderConfig = require('./vue-loader.conf')
const vuxLoader = require('vux-loader')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function fileExist(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

var entry = {
  app: './src/main.js'
};

var definePluginArr = [];
for (var key in dllConfig.entry) {
  // 模块入口
  entry[key] = dllConfig.entry[key];
  let manifestPath = resolve(`${/\.\.\//.test(dllConfig.outFile) ? dllConfig.outFile.slice(2) : dllConfig.outFile}/${key}_manifest.json`);
  // console.log(manifestPath)
  // 检测模块依赖对应关系文件是否存在
  if (!fileExist(manifestPath)) {
    console.log(`! 系统未检测到 ${key} 模块的依赖关系文件 请先执行 npm run dll`);
    process.exit(1);
  }
  console.log(`- 正在添加 ${key} 模块的依赖关系`);
  // 记录模块依赖对应关系
  definePluginArr.push(new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`${dllConfig.outFile}/${key}_manifest.json`)
  }))
}


let webpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  plugins: [
    ...definePluginArr,
    new HtmlWebpackPlugin({
      // 根据不同模式使用不同配置
      filename: config[process.env.NODE_ENV === 'production' ? 'build' : 'dev'].index,
      template: 'index.html',
      inject: true,
      hash: true,
      minify: {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //删除空白符与换行符
        removeAttributeQuotes: true //
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  ],
  module: {
    rules: [
      {
      test: /\.(vue|js|jsx)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
      enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: [
    'vux-ui',
    'progress-bar',
    {
      name: 'less-theme',
      path: 'src/style/theme.less'
    },
    {
      name: 'duplicate-style',
      options: {
        cssProcessorOptions : {
          safe: true,
          zindex: false,
          autoprefixer: {
            add: true,
            browsers: [
              'iOS >= 7',
              'Android >= 4.1'
            ]
          }
        }
      }
    }
  ]
})
