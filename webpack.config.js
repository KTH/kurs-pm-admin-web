const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry:
    [ '@babel/polyfill', './public/js/app/app.jsx', './public/css/memo-admin.scss' ],
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/babel.js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader' },

      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/memo-admin.css')
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
}
