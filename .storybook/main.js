const webpackConfig = require('../webpack.config.js');

module.exports = {
  stories: [
    "../src/**/*.stories.tsx"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  framework: "@storybook/react",
  core: {
    "builder": "@storybook/builder-webpack5"
  },
  webpackFinal: async (config) => {
    return { ...config, module: { ...config.module, rules: webpackConfig.module.rules }, resolve: {...config.resolve, ...webpackConfig.resolve}};
  },
}
