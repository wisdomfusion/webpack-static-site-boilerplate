const webpack = require('webpack');
const path    = require('path');

const DIST_PATH = path.resolve(__dirname, '../dist');

const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const TerserJSPlugin          = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin             = require('clean-webpack-plugin');
const HtmlPlugin              = require('html-webpack-plugin');

const { cssPreprocessor } = require('./loader');

module.exports = {
    mode: 'production',

    entry: {
        main:  './src/main.js',
        // index: './src/page-index/main.js',
        // about: './src/page-about/main.js',
    },

    output: {
        path:          DIST_PATH,
        filename:      'js/[name].[contenthash:8].js',
        chunkFilename: 'js/[name].[id].[chunkhash:8].js',
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,

                vendor: {
                    name:     'vendor',
                    test:     /node_modules/,
                    chunks:   'all',
                    priority: 20,
                    enforce:  true
                },

                common: {
                    name:               'common',
                    minChunks:          2,
                    chunks:             'async',
                    priority:           10,
                    reuseExistingChunk: true,
                    enforce:            true
                }
            }
        },
        minimizer:   [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: [
        new CleanPlugin(),

        new webpack.ProvidePlugin({
            $:               'jquery',
            'window.$':      'jquery',
            jQuery:          'jquery',
            'window.jQuery': 'jquery',
            Alert:           'exports-loader?Alert!bootstrap/js/dist/alert',
            Button:          'exports-loader?Button!bootstrap/js/dist/button',
            Carousel:        'exports-loader?Carousel!bootstrap/js/dist/carousel',
            Collapse:        'exports-loader?Collapse!bootstrap/js/dist/collapse',
            Dropdown:        'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
            Modal:           'exports-loader?Modal!bootstrap/js/dist/modal',
            Popover:         'exports-loader?Popover!bootstrap/js/dist/popover',
            Scrollspy:       'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
            Tab:             'exports-loader?Tab!bootstrap/js/dist/tab',
            Tooltip:         'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
            Util:            'exports-loader?Util!bootstrap/js/dist/util',
        }),

        new MiniCssExtractPlugin({
            filename:      'css/[name].[contenthash:8].css',
            chunkFilename: 'css/[name].[id].[chunkhash:8].css',
        }),

        new webpack.HashedModuleIdsPlugin(),
    ],

    module: {
        rules: [
            {
                test:   /bootstrap[\/\\]dist[\/\\]js[\/\\]umd[\/\\]/,
                loader: 'imports-loader?jQuery=jquery'
            },
            {
                test: require.resolve('jquery'),
                use:  [{
                    loader:  'expose-loader',
                    options: 'jQuery'
                }, {
                    loader:  'expose-loader',
                    options: '$'
                }]
            },
            {
                test:    /\.js$/i,
                exclude: /node_modules|test|dist/,
                use:     [
                    {
                        loader:  'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                ]
            },
            {
                test: cssPreprocessor.fileRegexp,
                use:  [
                    {
                        loader:  MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../',
                        },
                    },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use:  [
                    {
                        loader:  'file-loader',
                        options: {
                            outputPath: 'img',
                            name:       '[folder]/[name].[ext]',
                        },
                    },
                ],
            },
        ]
    },
};