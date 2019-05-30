// SASS & LESS, ready to use
const sass = { fileRegexp: /\.(sa|sc|c)ss$/i, loaderName: 'sass-loader' };
const less = { fileRegexp: /\.(le|c)ss$/i,    loaderName: 'less-loader' };

// set css preprocessor here
const cssPreprocessor = sass;

// add page modules here
// eg. 'index'
//   meanwhile, add ./src/modules/index/main.js,style.scss,template.html
// eg. 'service'
//   meanwhile, add ./src/modules/service/*
const pageModules = [
    'index',
    'about',
];

// paths to use
const path      = require('path');
const DIST_PATH = path.resolve(__dirname, './dist');
const SRC_PATH  = path.relative(__dirname, './src');

// webpack itself
const webpack = require('webpack');

// webpack plugins
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const TerserJSPlugin          = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanPlugin             = require('clean-webpack-plugin');
const HtmlPlugin              = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';

    let config = {
        mode: isDev ? 'development' : 'production',

        devtool: isDev ? 'inline-source-map' : 'source-map',

        devServer: isDev ? {
            port:        8080,
            contentBase: DIST_PATH,
            writeToDisk: false,
            index:       'index.html'
        } : {},

        entry: {
            main: './src/main.js',
            // automatically add entries according pageModules
            // eg:
            // index: './src/page-index/main.js',
            // about: './src/page-about/main.js',
        },

        output: {
            path:          DIST_PATH,
            filename:      isDev ? 'js/[name].js' : 'js/[name].[contenthash:8].js',
            chunkFilename: isDev ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
        },

        optimization: {
            splitChunks: {
                chunks:                 'all',
                minSize:                30000,
                maxSize:                0,
                minChunks:              1,
                maxAsyncRequests:       5,
                maxInitialRequests:     3,
                automaticNameDelimiter: '~',
                name:                   true,

                cacheGroups: {
                    vendors: {
                        name:               'vendors',
                        test:               /[\\/]node_modules[\\/]/,
                        chunks:             'all',
                        priority:           20,
                        reuseExistingChunk: true,
                        enforce:            true,
                    },
                }
            },

            // minify files when prod
            minimizer: !isDev ? [
                new TerserJSPlugin(),
                new OptimizeCSSAssetsPlugin(),
            ] : [],
        },

        plugins: [
            new CleanPlugin(),

            // provide jquery and bootstrap globally
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
                filename:      isDev ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
                chunkFilename: isDev ? 'css/[name].css' : 'css/[name].[chunkhash:8].css',
            }),

            new webpack.HashedModuleIdsPlugin(),
        ],

        module:  {
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
                    test: cssPreprocessor.fileRegexp, // using css preprocessor set above
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
                Modules:  SRC_PATH + '/modules',
                Partials: SRC_PATH + '/partials',
            },
        },
    };

    // bulk add pageModules define above to webpack config
    pageModules.forEach(pageModule => {
        config.entry[pageModule] = `./src/modules/${pageModule}/main.js`;

        config.plugins.push(new HtmlPlugin({
            template: `./src/modules/${pageModule}/template.html`,
            filename: `${pageModule}.html`,
            chunks:   ['vendor', 'main', pageModule],
            inject:   'head',

            // minify html if prod
            minify: !isDev ? {
                collapseWhitespace:            true,
                removeComments:                true,
                removeRedundantAttributes:     true,
                removeScriptTypeAttributes:    true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype:               true
            } : {},
        }))
    });

    return config;
};