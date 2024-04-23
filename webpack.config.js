const path = require('path')

//webpack 所有的配置信息都应该写在module.exports中
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.ts',
    preload: './src/Preload/index.ts'
  },
  target: 'node',
  //指定打包文件路径
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  // 这些选项决定了如何处理项目中的不同类型的模块
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }]
  },
  //这些选项能设置模块如何被解析
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '#': path.resolve(__dirname, 'types/')
    },
    extensions: ['.ts', '.js']
  },
  //webpack使用的插件配置
  plugins: [],
  externals: [
    'bufferutil',
    'utf-8-validate',
    'ffi-napi',
    'ref-napi',
    'ref-array-napi',
    'ref-struct-napi'
  ],
  externalsPresets: {
    node: true,
    electron: true,
    electronRenderer: true,
    electronMain: true
  }
}
