const { FlatCompat } = require("@eslint/eslintrc");
const reactConfig = require("@storm-software/linting-tools/eslint/react");
const baseConfig = require("../../eslint.config.js");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  ...baseConfig,
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    ...reactConfig,
    "files": ["packages/service-graph/**/*.json"],
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }))
];
