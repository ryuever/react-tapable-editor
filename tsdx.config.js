const postcss = require('rollup-plugin-postcss');
const path = require('path')

module.exports = {
  rollup(config, options) {
    config.plugins.push(
      postcss({
        // modules: true,
        extract: true,
        // Or with custom file name
        extract: path.resolve('dist/my-custom-file-name.css')
      })
    );
    return config;
  },
};

// import path from 'path'
// postcss({
//   extract: true,
//   // Or with custom file name
//   extract: path.resolve('dist/my-custom-file-name.css')
// })