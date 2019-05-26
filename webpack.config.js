const env = process.env.NODE_ENV;

module.exports = env => {
    return require(`./build/webpack.${env}.js`);
};