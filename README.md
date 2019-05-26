# Webpack 4 static site boilerplate with ES6+, SASS/LESS support and dev-server

## Instructions

This Webpack 4 Boilerplate comes with 4 builds:

```
npm run start
```

starts dev server on `localhost:8080` with livereload, sourcemap


```
npm run dev
```

// TODO


```
npm run prod
```

// TODO

creates prod files to /dist with:

1. compiles sass/stylus/less to css 
2. autoprefixer for vendor prefixes (browser compability) 
3. compiles ES6+ to ES5 
4. minifying for css/js 
5. uglyfing js code 
6. hash css and js file (file versioning for browser caching -> cache busting) 


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

Set `cssPreprocessor` in build/loader.js to sass.

### LESS Preprocessor

```
npm i -D less less-loader
npm rm node-sass sass-loader
```

Set `cssPreprocessor` in build/loader.js to less.