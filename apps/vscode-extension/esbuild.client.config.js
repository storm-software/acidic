const { esbuildDecorators } = require("@anatine/esbuild-decorators");

module.exports = {
  mainFields: ["module", "main"],
  outExtension: {
    ".js": ".js"
  },
  sourcemap: "both",
  sourcesContent: true,
  treeShaking: true,
  jsx: "automatic",
  logLevel: "error",
  define: {
    "import.meta.url": "importMetaUrl"
  },
  inject: ["./apps/vscode-extension/esbuild.shim.js"],
  plugins: [
    esbuildDecorators({
      tsconfig: "apps/vscode-extension/tsconfig.client.json"
    })
  ]
};
