module.exports = {
  // plugins: [require('autoprefixer')],
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'firefox > 31', 'ie >= 8', 'last 10 versions'],
    },
    'postcss-pxtorem': {
      rootValue: 20,
      propList: ['*'],
    },
  },
};
