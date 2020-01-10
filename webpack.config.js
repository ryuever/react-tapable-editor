// eslint-disable-next-line @typescript-eslint/no-var-requires


const HtmlWebpackPlugin = require('html-webpack-plugin');

const { DIR, EXT = 'ts' } = process.env;

module.exports = {
  mode: 'development',
  entry: `./examples/${DIR}/index.${EXT}`,
  plugins: [
    new HtmlWebpackPlugin({
      template: `./examples/${DIR}/public/index.html`,
    }),
  ],
  module: {
    rules: [{
      test: /\.jsx?/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
          ]
        },
      }],
    }, {
      test: /\.tsx?/,
      loader: 'ts-loader',
    }, {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      'react-tapable-editor': __dirname,
    },
    // fix npm link error `https://github.com/webpack/webpack/issues/811`
    symlinks: false,
  },
  devServer: {
    port: process.env.PORT || '8080',
  },
};
