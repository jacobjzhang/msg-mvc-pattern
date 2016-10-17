var path              = require('path');
var webpack           = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var env               = process.env.BUILD_ENV || '0';
var isDevEnv          = env === '1';
var isProdEnv         = env === '0';

var webpackConfig = {
  devtool : 'source-map',
  entry   : {
    'bundle' : './src/js/index.js',
  },
  output  : {
    path     : path.join(__dirname, 'build'),
    filename : 'js/[name].js',
  },
  module  : {

    preLoaders : [
      {
        test    : /\.js$/,
        loader  : 'eslint',
        include : path.join(__dirname, 'src'),
      }
    ],

    loaders : [
      {
        test    : /\.js$/,
        exclude : /node_modules/,
        loader  : 'babel',
        query   : {
          presets : ['es2015-native-modules']
        }
      },
    ]
  },

  // Point ESLint to our predefined config.
  eslint : {
    configFile  : path.join(__dirname, '.eslintrc.js'),
    useEslintrc : false
  },

  plugins : [

    // env plugin
    new webpack.DefinePlugin({
      "__DEV__" : JSON.stringify(JSON.parse(env))
    }),

    // make all our custom JS available as Globals
    new webpack.ProvidePlugin({
      "__CD__"       : require.resolve("./node_modules/cropduster/lib/cropduster"),
      "__Backpack__" : require.resolve("./node_modules/backpack/lib/backpack"),
      "__Sherlock__" : require.resolve("./node_modules/sherlockapi/lib/sherlock"),
    }),

    // copy css dir to build dir
    new CopyWebpackPlugin([
      {
        from : "src/css/styles.css",
        to   : "css/styles.css"
      },
      {
        from : "src/img/",
        to   : "img"
      },
    ]),

  ]
};

//uglify js
if(isProdEnv){

  var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
    compress  : {warnings : false},
    output    : {comments : false},
    sourceMap : true
  });
  webpackConfig.plugins.push(uglifyPlugin);

}


module.exports = webpackConfig;
