// Production webpack config for server code

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const clone = require('lodash.clonedeep');
const { serverSrcPath, serverBuildPath, publicSrcPath } = require('kyt-utils/paths')();
const postcssLoader = require('../utils/getPostcssLoader');

const cssStyleLoaders = [
  {
    loader: 'css-loader/locals',
    options: {
      modules: true,
      localIdentName: '[name]-[local]--[hash:base64:5]',
    },
  },
  postcssLoader,
];

module.exports = options => ({
  target: 'node',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: nodeExternals(),

  entry: {
    main: ['babel-polyfill', `${serverSrcPath}/index.js`],
  },

  output: {
    path: serverBuildPath,
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.publicPath,
    libraryTarget: 'commonjs2',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssStyleLoaders,
        exclude: [publicSrcPath],
      },
      {
        test: /\.scss$/,
        use: clone(cssStyleLoaders).concat('sass-loader'),
        exclude: [publicSrcPath],
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: true,
    }),

    // Scope Hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
});
