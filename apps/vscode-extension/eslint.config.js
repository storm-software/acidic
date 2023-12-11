const { FlatCompat } = require("@eslint/eslintrc");
const baseConfig = require("../../eslint.config.js");
const js = require("@eslint/js");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});
module.exports = [
  ...baseConfig,
  {
    files: [
      "packages/vscode-extension/**/*.ts",
      "packages/vscode-extension/**/*.tsx",
      "packages/vscode-extension/**/*.js",
      "packages/vscode-extension/**/*.jsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/vscode-extension/**/*.ts",
      "packages/vscode-extension/**/*.tsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/vscode-extension/**/*.js",
      "packages/vscode-extension/**/*.jsx"
    ],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["packages/vscode-extension/**/*.json"],
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }))
];
