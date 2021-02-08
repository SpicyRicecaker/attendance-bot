const path = require('path');
const nodeExternals = require('webpack-node-externals');

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  // Entry is index.ts obviously
  entry: './src/index.ts',
  // Make sure that sourcemaps are enabled in `tsconfig.json`, helps with debugging
  devtool: 'inline-source-map',
  module: {
    rules: [
      // `ts-loader` enables typescript support
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // Asset modules, in this case we're saying add all `.json` files as a resource 
      // to the final build
      {
        test: /\.json/,
        type: 'asset/resource',
      },
    ],
  },
  // Set to production
  mode: NODE_ENV,
  // Target node is important if you're not running in browser
  target: 'node',
  // Where to output
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  // *TODO*
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // Very important, says that we should not bundle some things that we expect
  // the client to have, e.g. nodejs, puppeteer, etc.
  externals: [nodeExternals()],
};
