var elixir = require('laravel-elixir');

elixir.ready(function () {
  elixir.webpack.mergeConfig({
    resolve: {
      alias: {
        vue: 'vue/dist/vue.common.js'
      },
      extensions: ['.js', '.vue']
    },
    vue: {
      buble: {
        objectAssign: 'Object.assign'
      }
    },
    module: {
      loaders: [
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          loader: 'buble-loader',
          query: {
            objectAssign: 'Object.assign',
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'file-loader',
          query: {
            limit: 10000,
            name: '../img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: '../fonts/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.html$/,
          loader: "html-loader"
        }
      ]
    }
  })
});

module.exports = elixir;
