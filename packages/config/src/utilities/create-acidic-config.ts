import { createConfig } from "@storm-software/config-tools";
import { AcidicConfig } from "../types";

export const createAcidicConfig = (workspaceRoot?: string): AcidicConfig => {
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
        outputPath:
          (acidic?.outputPath ? acidic.outputPath : storm.runtimeDirectory) ??
          "./node_modules/.storm"
      }
    }
  };
};
