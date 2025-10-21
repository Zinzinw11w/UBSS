const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util'),
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        os: require.resolve('os-browserify/browser'),
        https: require.resolve('https-browserify'),
        http: require.resolve('stream-http'),
        vm: require.resolve('vm-browserify'),
        fs: false,
        net: false,
        tls: false,
        process: require.resolve('process/browser'),
      };
      
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser.js',
        }),
      ];
      
      return webpackConfig;
    },
  },
};
