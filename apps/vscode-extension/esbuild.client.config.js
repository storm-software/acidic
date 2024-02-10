const { esbuildDecorators } = require("@anatine/esbuild-decorators");
const postCssPlugin = require("esbuild-style-plugin");

module.exports = {
  mainFields: ["module", "main"],
  outExtension: {
    ".js": ".js"
  },
  loader: {
    ".png": "dataurl",
    ".jpeg": "dataurl",
    ".svg": "dataurl",
    ".webp": "dataurl",
    ".node": "dataurl"
  },
  sourcemap: "both",
  sourcesContent: true,
  treeShaking: true,
  jsx: "automatic",
  logLevel: "error",
  outdir: "dist/apps/vscode-extension/client",
  define: {
    "import.meta.url": "importMetaUrl"
  },
  inject: ["./apps/vscode-extension/esbuild.shim.js", "./apps/vscode-extension/react.shim.js"],
  plugins: [
    esbuildDecorators({
      tsconfig: "apps/vscode-extension/tsconfig.client.json"
    }),
    postCssPlugin({
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")]
      }
    })
  ]
};
