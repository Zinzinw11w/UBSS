const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser.js"),
        "vm": require.resolve("vm-browserify"),
        "util": false,
        "url": false,
        "fs": false,
        "path": false,
        "os": false
      };
      
      // Add process polyfill to plugins
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
        }),
      ];
      
      return webpackConfig;
    }
  }
};