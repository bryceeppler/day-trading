// to use jest with typescript, we need babel to bundle to js
// only used for VSCode extension
module.exports = {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
  };