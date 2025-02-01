const path = require('path');

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: './src/fs.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
  },
};