const { esbuildDecorators } = require("@anatine/esbuild-decorators");
const esbuildPluginPino = require("esbuild-plugin-pino");

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
  outdir: "dist/apps/vscode-extension",
  define: {
    "import.meta.url": "importMetaUrl"
  },
  inject: ["./apps/vscode-extension/esbuild.shim.js"],
  plugins: [
    esbuildDecorators({
      tsconfig: "apps/vscode-extension/tsconfig.extension.json"
    }),
    esbuildPluginPino({ transports: ["pino-pretty"] })
  ]
};
