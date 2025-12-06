/**
 * The plugin library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * A package containing the base plugin code used to extend the Acidic Engine
 *
 * @packageDocumentation
 */

export const plugin = {
  name: "plugin",
  version: "1.0.0",
  description:
    "The plugin library used by Storm Software for building TypeScript applications.",
  main: "dist/index.js",
  types: "dist/index.d.ts",
  scripts: {
    build: "tsc",
    test: "jest",
    lint: "eslint .",
    "lint:fix": "eslint . --fix"
  },
  repository: {
    type: "git",
    url: "git+"
  }
};
