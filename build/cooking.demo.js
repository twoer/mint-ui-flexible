var cooking = require('cooking');
var webpack = require('webpack');
var config = require('./config');
var isProduction = process.env.NODE_ENV === 'production';
var cssLoader = require('./css-loader');

var px2remConfig = {
  baseDpr: 1,             // base device pixel ratio (default: 2)
  remUnit: 37.5,            // rem unit value (default: 75)
  remPrecision: 6,        // rem value precision (default: 6)
  forcePxComment: 'px',   // force px comment (default: `px`)
  keepComment: 'no',       // no transform value comment (default: `no`)
  shouldUseDprRule: function(rule){
    var list = ['font', 'font-size'];
    return list.some(function(item) {
      return item === rule.property;
    })
  },
  shouldIgnoreRule: function(rule) {
    return  /border/.test(rule.property);
  }
}


cooking.set({
  entry: './example/entry.js',
  dist: './example/dist',
  template: './example/index.tpl',
  devServer: {
    port: 8790,
    host: require('my-local-ip')(),
    publicPath: '/',
    log: false
  },
  clean: true,
  hash: true,
  publicPath: '/mint-ui/',
  assetsPath: 'static',
  urlLoaderLimit: 10000,
  extractCSS: true,
  sourceMap: true,
  // extends: ['vue2', 'lint', 'saladcss', 'buble'],
  alias: config.alias,
  externals: process.env.NODE_ENV === 'production' ? {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'fastclick': 'FastClick'
  } : {}
});


var SOURCE_MAP = cooking.config.devtool

cooking.config.vue = cooking.config.vue || {}

// add loader
cooking.add('loader.vue', {
  test: /\.vue$/,
  loaders: ['vue-loader']
})

// add extension
cooking.config.resolve.extensions.push('.vue')

cooking.config.vue.autoprefixer = true;

// add vue config
cooking.config.vue.loaders = Object.assign({}, cooking.config.vue.loaders, cssLoader({
  sourceMap: SOURCE_MAP ? '#source-map' : false,
  extract: !!cooking.config.extractCSS
}))

cooking.config.vue.postcss = [
  require('postcss-partial-import'),
  require('postcss-url'),
  require('saladcss-bem'),
  require('precss'),
  require('postcss-sass-color-functions'),
  require('postcss-css-reset'),
  require('postcss-utils'),
  require('postcss-calc'),
  require('postcss-initial'),
  require('postcss-inline-svg'),
  require('postcss-short'),
  require('postcss-shape'),
  require('pixrem'),
  require('autoprefixer'),
  require('postcss-neat'),
  require('postcss-px2rem-dpr')( px2remConfig )
];

cooking.config.extends = [ 'lint', 'saladcss', 'buble'];



module.exports = cooking.resolve();




