const merge  = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode:    'staging',
    devtool: 'source-map',
});