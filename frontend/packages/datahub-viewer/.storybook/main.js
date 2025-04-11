// Copyright (c) 2025 NTT InfraNet
const path = require('path')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')

// resolve cesium entry file as it could be local or hoisted by lerna
const cesiumPath = require.resolve('cesium').split('/')
// remove filename to leave the cesium path
cesiumPath.pop()
// append the unminified build
const cesiumUnminifiedPath = [...cesiumPath, 'Build', 'CesiumUnminified'].join(
  '/'
)

module.exports = {
  stories: ['../src/**/*.story.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs/register',
    'storybook-addon-i18n/register.js'
  ],
  webpackFinal: async (config, { configType }) => {
    config.externals = {
      cesium: 'Cesium'
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          CESIUM_BASE_URL: JSON.stringify('/cesium')
        }
      })
    )

    config.plugins.push(
      new CopyPlugin([
        {
          from: cesiumUnminifiedPath,
          to: 'cesium'
        }
      ])
    )

    config.module.rules.push({
      test: /\.story\.js?$/,
      loaders: [
        {
          loader: require.resolve('@storybook/source-loader')
        }
      ],
      enforce: 'pre'
    })

    config.devtool = 'inline-source-map'

    return config
  }
}
