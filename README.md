# Webpack 4 static site boilerplate with ES6+, SASS/LESS support and dev-server

## Instructions

This Webpack 4 Boilerplate comes with 4 build options:

### start build

starts dev server on `localhost:8080` with livereload:

```
npm run start
```

### watch build

builds in development mode, and watch source files in `./src`, build when files changes:

```
npm run watch
```

### dev build

builds in development mode:

```
npm run dev
```

### prod build

builds in production mode, with optimization and minimization:

```
npm run prod
```

## Setup

```
npm i
```

## Preprocessor support (default: Sass)

### SASS PreProcessor

```
npm i -D less less-loader
npm rm node-sass sass-loader
```

Set `cssPreprocessor` in webpack.config.js to **sass**.

### LESS Preprocessor

```
npm i -D less less-loader
npm rm node-sass sass-loader
```

Set `cssPreprocessor` in webpack.config.js to **less**.