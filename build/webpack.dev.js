const webpack = require('webpack');
const path    = require('path');

const SRC_PATH  = path.resolve(__dirname, '../src');
const DIST_PATH = path.resolve(__dirname, '../dist');

const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const TerserJSPlugin          = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin             = require('clean-webpack-plugin');
const HtmlPlugin              = require('html-webpack-plugin');

const { cssPreprocessor } = require('./loader');

module.exports = {
    mode: 'development',

    devtool: 'inline-source-map',

    devServer: {
        port:        8080,
        contentBase: DIST_PATH,
        writeToDisk: false,
        compress:    true,
        index:       'index.html'
    },

    entry: {
        index: SRC_PATH + '/page-index/main.js',
        about: SRC_PATH + '/page-about/main.js',
    },

    output: {
        path:     DIST_PATH,
        filename: 'js/[name].js',
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
            filename: 'css/[name].css',
        }),
        new webpack.HashedModuleIdsPlugin(),

        new HtmlPlugin({
            template: SRC_PATH + '/page-index/template.html',
            chunks:   ['vendor', 'index'],
            filename: 'index.html',
        }),
        new HtmlPlugin({
            template: SRC_PATH + '/page-about/template.html',
            chunks:   ['vendor', 'about'],
            filename: 'about.html',
        }),
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

    resolve: {
        alias: {
            '@': SRC_PATH
        }
    },
};