const webpack = require('webpack');
const path    = require('path');

const SRC_PATH  = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');

const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const TerserJSPlugin          = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin      = require('clean-webpack-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const CopyWebpackPlugin       = require('copy-webpack-plugin');

module.exports = {
    entry:        {
        index: './src/page-index/main.js',
        about: './src/page-about/main.js',
    },
    output:       {
        filename: '[name].js',
        path:     DIST_PATH,
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
            }
        },
        minimizer:   [
            new TerserJSPlugin({}),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module:       {
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
                test: /\.(sa|sc|c)ss$/,
                use:  [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader:  'postcss-loader',
                        options: {
                            plugins: function () {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                use:  [
                    {
                        loader:  'url-loader',
                        options: {
                            name:  '[path][name].[ext]?hash=[hash:20]',
                            limit: 8192
                        }
                    }
                ]
            }
        ]
    },
    plugins:      [
        new CleanWebpackPlugin(),

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
            filename:      '[name].css',
            chunkFilename: '[name].css',
        }),
        new webpack.HashedModuleIdsPlugin(),

        new HtmlWebpackPlugin({
            template: './src/page-index/template.html',
            chunks:   ['vendor', 'index'],
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: './src/page-about/template.html',
            chunks:   ['vendor', 'about'],
            filename: 'about.html',
        }),
    ],
    resolve:      {
        alias: {
            '@': SRC_PATH
        }
    },
};