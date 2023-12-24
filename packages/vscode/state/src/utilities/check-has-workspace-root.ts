import { findWorkspaceRootSafe } from "@storm-software/config-tools";

/**
 * Check if the workspace root is valid
 *
 * @param workspaceRoot - The workspace root to check
 * @returns An indicator specifying whether the workspace root is valid
 */
export const checkHasWorkspaceRoot = async (
  workspaceRoot?: string
): Promise<boolean> => {
  const foundWorkspaceRoot = findWorkspaceRootSafe(workspaceRoot);
  if (!foundWorkspaceRoot) {
    return false;
  }

  return (
    (workspaceRoot && workspaceRoot === foundWorkspaceRoot) || !workspaceRoot
  );
};
