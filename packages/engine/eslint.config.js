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
      "packages/engine/**/*.ts",
      "packages/engine/**/*.tsx",
      "packages/engine/**/*.js",
      "packages/engine/**/*.jsx"
    ],
    parserOptions: { project: ["packages/engine/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["packages/engine/**/*.ts", "packages/engine/**/*.tsx"],
    rules: {}
  },
  {
    files: ["packages/engine/**/*.js", "packages/engine/**/*.jsx"],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["packages/engine/**/*.json"],
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }))
];
