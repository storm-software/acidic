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
      "apps/cli/**/*.ts",
      "apps/cli/**/*.tsx",
      "apps/cli/**/*.js",
      "apps/cli/**/*.jsx"
    ],
    parserOptions: { project: ["apps/cli/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["apps/cli/**/*.ts", "apps/cli/**/*.tsx"],
    rules: {}
  },
  {
    files: ["apps/cli/**/*.js", "apps/cli/**/*.jsx"],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["apps/cli/**/*.json"],
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }))
];
