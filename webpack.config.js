const env = process.env.NODE_ENV;

const HtmlPlugin = require('html-webpack-plugin');

module.exports = env => {
    let config = require(`./build/webpack.${env}.js`);

    const pageModules = [
        'index',
        'about',
    ];

    pageModules.forEach(pageModule => {
        config.entry[pageModule] = `./src/${pageModule}/main.js`;

        config.plugins.push(new HtmlPlugin({
            template: `./src/${pageModule}/template.html`,
            filename: `${pageModule}.html`,
            chunks:   ['vendor', 'main', pageModule],
            inject:   'head',
            minify:   env === 'prod' ? {
                collapseWhitespace:            true,
                removeComments:                true,
                removeRedundantAttributes:     true,
                removeScriptTypeAttributes:    true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype:               true
            } : { },
        }))
    });

    return config;
};