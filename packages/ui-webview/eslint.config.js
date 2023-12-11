const baseConfig = require("../../eslint.config.js");

module.exports = [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    parserOptions: { project: ["packages/ui-webview/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {}
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    rules: {}
  },
  ...compat.extends("plugin:@nx/react")
];
