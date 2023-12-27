const { esbuildDecorators } = require("@anatine/esbuild-decorators");

module.exports = {
  mainFields: ["module", "main"],
  outExtension: {
    ".js": ".js"
  },
  sourcemap: "both",
  sourcesContent: true,
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
      tsconfig: "apps/vscode-extension/tsconfig.extension.json"
    })
  ]
};
