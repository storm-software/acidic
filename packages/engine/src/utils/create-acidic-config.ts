import { createConfig, loadStormConfig } from "@storm-software/config-tools";
import type { AcidicConfig } from "@acidic/definition";
import { joinPaths } from "@storm-stack/file-system";

export const createAcidicConfig = async (workspaceRoot?: string): Promise<AcidicConfig> => {
  await loadStormConfig(workspaceRoot);

  const storm = createConfig(workspaceRoot);
  const acidic = storm?.extensions?.acidic;

  return {
    ...storm,
    extensions: {
      ...storm?.extensions,
      acidic: {
        defaultOptions: {},
        input: "**/*.acid",
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/.git/**",
          "**/.idea/**",
          "**/.vscode/**",
          "**/build/**",
          "**/coverage/**",
          "**/tmp/**"
        ],
        ...acidic,
        cacheDirectory: joinPaths(
          storm?.workspaceRoot ? storm.workspaceRoot : workspaceRoot,
          acidic?.cacheDirectory
            ? acidic.cacheDirectory
            : storm?.cacheDirectory
              ? joinPaths(storm.cacheDirectory, "acidic")
              : "node_modules/.cache/storm/acidic"
        ),
        outputPath:
          (acidic?.outputPath ? acidic.outputPath : storm.runtimeDirectory) ??
          "./node_modules/.storm"
      }
    }
  };
};
