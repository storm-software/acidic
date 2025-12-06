/**
 * Get the directory where the binaries should be installed
 *
 * @returns The directory where the binaries should be installed
 */
export async function getBinDirectory(): Promise<string | null> {
  if (os.platform() === "win32") {
    const cacheDir = findCacheDir({ name: "acidic-engine", create: true });
    if (cacheDir) {
      return cacheDir;
    }
    if (process.env.APPDATA) {
      return path.join(process.env.APPDATA, "Storm Software", "Acidic");
    }
  }

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    try {
      await ensureDir(`/tmp/acidic-engine`);
      return `/tmp/acidic-engine`;
    } catch (e) {
      return null;
    }
  }
  return path.join(os.homedir(), ".cache/acidic-engine");
}
