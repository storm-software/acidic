const { esbuildDecorators } = require("@anatine/esbuild-decorators");

module.exports = {
  mainFields: ["module", "main"],
  sourcemap: "both",
  outExtension: {
    ".js": ".js"
  },
  treeShaking: true,
  loader: {
    ".node": "dataurl"
  },
  logLevel: "error",
  define: {
    "import.meta.url": "importMetaUrl"
  },
  inject: ["./apps/vscode-extension/esbuild.shim.js"],
  plugins: [
    esbuildDecorators({
      tsconfig: "apps/vscode-extension/tsconfig.app.json"
    })
  ]
};
