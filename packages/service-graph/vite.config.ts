/// <reference types='vitest' />
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import react from "@vitejs/plugin-react-swc";
import * as path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  root: __dirname,
  cacheDir: "../../node_modules/.vite/packages/service-graph",

  esbuild: {
    jsxInject: `import React from 'react'; \nimport "reactflow/dist/style.css";`
  },

  assetsInclude: ["../../assets/images/bg-noise.webp", "../../assets/icons/dark/icon.png"],

  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: "src",
      tsConfigFilePath: path.join(__dirname, "tsconfig.lib.json"),
      skipDiagnostics: true
    })
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: "../../dist/packages/service-graph",
    reportCompressedSize: true,
    emptyOutDir: true,
    sourcemap: true,
    minify: false,

    commonjsOptions: {
      transformMixedEsModules: true
    },

    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: "src/index.ts",
      name: "service-graph",
      fileName: "index",
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      // External packages that should not be bundled into your library.
      external: ["react", "react-dom", "react/jsx-runtime"]
    }
  },
  define: {
    "import.meta.vitest": undefined
  },
  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest"
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    includeSource: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    reporters: ["default"],
    coverage: {
      reportsDirectory: "../../coverage/packages/service-graph",
      provider: "v8"
    }
  }
});
