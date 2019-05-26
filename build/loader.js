const sass = {
    fileRegexp: /\.(sa|sc|c)ss$/i,
    loaderName: 'sass-loader'
};

const less = {
    fileRegexp: /\.(le|c)ss$/i,
    loaderName: 'less-loader'
};

module.exports = {
    cssPreprocessor: sass
};