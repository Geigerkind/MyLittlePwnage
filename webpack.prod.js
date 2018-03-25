const path = require("path")
const merge = require('webpack-merge');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Workbox = require('workbox-webpack-plugin');
const SubResourceIntegrityPlugin = require('webpack-subresource-integrity');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const WebpackAutoInject = require('webpack-auto-inject-version')

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new Workbox.InjectManifest({
      swSrc: path.resolve('sw.js'),
      exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /^icon/]
    }),
    new FaviconsWebpackPlugin('./lib/img/party_hard_by_wolferahm-d6c8oge.png'),
    new WebpackPwaManifest({
      name: 'My Little Pwnage',
      short_name: 'My Pwnage',
      description: 'Guess the amount of times a password was pwned!',
      theme_color: '#303030',
      background_color: '#303030',
      orientation: "portrait",
      display: "standalone",
      start_url: "/index.html?utm=homescreen",
      icons: [
        {
          src: path.resolve('lib/img/party_hard_by_wolferahm-d6c8oge.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024] // multiple sizes
        }
      ]
    }),
    new WebpackAutoInject({
      components: {
        AutoIncreaseVersion: false,
        InjectByTag: true,
        InjectAsComment: false
      },
      componentsOptions: {
        InjectByTag: {
          dateFormat: 'UTC:yyyy-mm-dd HH:MM:ss Z'
        }
      },
    })
 //   new BundleAnalyzerPlugin()

  ]
});