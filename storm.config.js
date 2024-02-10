/** @type {import('@storm-software/config-tools').StormConfig} */
module.exports = {
  name: "acidic",
  namespace: "acidic",
  organization: "storm-software",
  packageManager: "pnpm",
  owner: "@storm-software/development",
  worker: "stormie-bot",
  runtimeDirectory: "node_modules/.storm",
  repository: "https://github.com/storm-software/acidic",
  timezone: "America/New_York",
  locale: "en-US",
  ci: true,
  logLevel: "all",
  externalPackagePatterns: ["@acidic/", "@storm-software/", "@storm-stack/"],
  colors: {
    primary: "#1fb2a6",
    background: "#1d232a",
    success: "#087f5b",
    info: "#0ea5e9",
    warning: "#fcc419",
    error: "#990000",
    fatal: "#7d1a1a"
  },
  extensions: {
    telemetry: {
      fileName: "storm",
      fileExtension: "log",
      path: "tmp/storm/logs",
      stacktrace: true
    }
  }
};
