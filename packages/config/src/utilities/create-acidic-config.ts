import { createConfig } from "@storm-software/config-tools";
import { AcidicConfig } from "../types";

export const createAcidicConfig = (workspaceRoot?: string): AcidicConfig => {
  const storm = createConfig(workspaceRoot);
  const acidic = storm?.extensions?.acidic ?? {};

  return {
    ...storm,
    defaultOptions: acidic?.defaultOptions ?? {},
    outputPath:
      (acidic?.outputPath ? acidic.outputPath : storm.runtimeDirectory) ??
      "./node_modules/.storm"
  };
};
