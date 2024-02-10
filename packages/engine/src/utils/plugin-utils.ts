import { StormTrace } from "@storm-stack/telemetry";
import fs from "node:fs";
import path, { join } from "node:path";

export const ALL_OPERATION_KINDS = ["create", "update", "postUpdate", "read", "delete"];

const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
export function getNodeModulesFolder(_startPath?: string): string | undefined {
  let startPath = _startPath;

  startPath = startPath ?? process.cwd();
  if (startPath?.endsWith("node_modules")) {
    return startPath;
  }
  if (fs.existsSync(path.join(startPath, "node_modules"))) {
    return path.join(startPath, "node_modules");
  }
  if (startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) {
    const parent = path.join(startPath, "..");
    return getNodeModulesFolder(parent);
  }
  return undefined;
}

/**
 * Ensure the default output folder is initialized.
 */
export const ensureOutputFolder = (outputPath?: string): string | undefined => {
  const output = outputPath
    ? outputPath
    : process.env.STORM_WORKSPACE_ROOT
      ? process.env.STORM_WORKSPACE_ROOT
      : getDefaultOutputFolder();
  if (output && !fs.existsSync(output)) {
    fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(
      path.join(output, "package.json"),
      JSON.stringify({ name: ".storm", version: "1.0.0" })
    );
  }

  return output;
};

/**
 * Gets the default node_modules/.storm output folder for plugins.
 * @returns
 */
export function getDefaultOutputFolder() {
  depth = 0;

  let modulesFolder = process.env.STORM_RUNTIME_MODULE;
  if (!modulesFolder) {
    const runtimeModuleFolder = "@acidic/runtime";
    StormTrace.debug(`Searching for Acidic Runtime in ${runtimeModuleFolder}`);

    // Find the real runtime module path, it might be a symlink in pnpm
    let runtimeModulePath = require.resolve(runtimeModuleFolder);
    StormTrace.debug(`Loading Acidic Runtime from ${runtimeModulePath}`);

    if (runtimeModulePath) {
      // start with the parent folder of @acidic, supposed to be a node_modules folder
      while (
        !runtimeModulePath.endsWith("@acidic") &&
        runtimeModulePath !== "/" &&
        depth++ < MAX_PATH_SEARCH_DEPTH
      ) {
        runtimeModulePath = join(runtimeModulePath, "..");
      }
      runtimeModulePath = join(runtimeModulePath, "..");
    }
    modulesFolder = getNodeModulesFolder(runtimeModulePath);
  }

  return modulesFolder
    ? modulesFolder.endsWith(".storm")
      ? modulesFolder
      : join(modulesFolder, ".storm")
    : undefined;
}
