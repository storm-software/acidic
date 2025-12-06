import { createWriteStream, promises } from "node:fs";
import hasha from "hasha";
import fetch from "node-fetch";
import retry from "p-retry";
import { join } from "node:path";
import { rimraf } from "rimraf";
import { temporaryDirectory } from "tempy";
import zlib from "node:zlib";
import { getProxyAgent } from "./get-proxy-agent";
import type { StormTrace } from "@storm-stack/telemetry";

export type DownloadResult = {
  lastModified: string;
  sha256: string | null;
  zippedSha256: string | null;
};

async function fetchChecksum(
  logger: StormTrace,
  url: string
): Promise<string | null> {
  try {
    const checksumUrl = `${url}.sha256`;
    const response = await fetch(checksumUrl, {
      agent: getProxyAgent(url)
    });

    if (!response.ok) {
      let errorMessage = `Failed to fetch sha256 checksum at ${checksumUrl} - ${response.status} ${response.statusText}`;
      if (!process.env.ACIDIC_INSTALL_CHECKSUM_IGNORE_MISSING) {
        errorMessage += `\n\nIf you need to ignore this error (e.g. in an offline environment), set the ACIDIC_INSTALL_CHECKSUM_IGNORE_MISSING environment variable to a truthy value.\nExample: ACIDIC_INSTALL_CHECKSUM_IGNORE_MISSING=1`;
      }
      throw new Error(errorMessage);
    }

    const body = await response.text();
    // We get a string like this:
    // "3c82ee6cd9fedaec18a5e7cd3fc41f8c6b3dd32575dc13443d96aab4bd018411  query-engine.gz\n"
    // So we split it by whitespace and just get the hash, as that's what we're interested in
    const [checksum] = body.split(/\s+/);
    if (!/^[a-f0-9]{64}$/gi.test(checksum!)) {
      throw new Error(
        `Unable to parse checksum from ${checksumUrl} - response body: ${body}`
      );
    }

    return checksum!;
  } catch (error) {
    if (process.env.ACIDIC_INSTALL_CHECKSUM_IGNORE_MISSING) {
      logger.debug(
        `fetchChecksum() failed and was ignored as the ACIDIC_INSTALL_CHECKSUM_IGNORE_MISSING environment variable is truthy.\nError: ${error}`
      );
      return null;
    }
    throw error;
  }
}

export async function download(
  logger: StormTrace,
  url: string,
  target: string,
  progressCb?: (progress: number) => void
): Promise<DownloadResult> {
  const tmpDir = temporaryDirectory();
  const partial = join(tmpDir, "partial");

  // We try 3 times,
  // Once + 2 retries
  const RETRIES_COUNT = 2;

  const [zippedSha256, sha256] = await retry(
    async () => {
      return await Promise.all([
        fetchChecksum(logger, url),
        fetchChecksum(logger, url.slice(0, url.length - 3))
      ]);
    },
    {
      retries: RETRIES_COUNT,

      onFailedAttempt: (err: any) =>
        logger.error(
          `An error occurred while downloading the checksums files: ${err?.message ? err?.message : "No error was written during failure"}`
        )
    }
  );

  const result = await retry(
    async () => {
      const response = await fetch(url, {
        compress: false,
        agent: getProxyAgent(url)
      });
      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to fetch the engine file at ${url} - ${response.status} ${response.statusText}`
        );
      }

      const lastModified = response.headers.get("last-modified")!;
      const size = Number.parseFloat(
        response.headers.get("content-length") as string
      );
      const ws = createWriteStream(partial);

      return await new Promise(async (resolve, reject) => {
        let bytesRead = 0;
        if (!response.body) {
          return reject(new Error("Response body is undefined"));
        }

        response.body.on("error", reject).on("data", chunk => {
          bytesRead += chunk.length;

          if (size && progressCb) {
            progressCb(bytesRead / size);
          }
        });

        const gunzip = zlib.createGunzip();
        gunzip.on("error", reject);

        const zipStream = response.body.pipe(gunzip);
        const zippedHashPromise = hasha.hash(response.body, {
          algorithm: "sha256"
        });

        const hashPromise = hasha.hash(zipStream, {
          algorithm: "sha256"
        });

        zipStream.pipe(ws);

        ws.on("error", reject).on("close", () => {
          resolve({ lastModified, sha256, zippedSha256 });
        });

        const hash = await hashPromise;
        const zippedHash = await zippedHashPromise;

        if (zippedSha256 !== null && zippedSha256 !== zippedHash) {
          return reject(
            new Error(
              `sha256 checksum of ${url} (zipped) should be ${zippedSha256} but is ${zippedHash}`
            )
          );
        }

        if (sha256 !== null && sha256 !== hash) {
          return reject(
            new Error(
              `sha256 checksum of ${url} (unzipped) should be ${sha256} but is ${hash}`
            )
          );
        }
      });
    },
    {
      retries: RETRIES_COUNT,
      onFailedAttempt: (err: any) =>
        logger.error(
          `An error occurred while downloading the Acidic Engine binaries: ${err?.message ? err?.message : "No error was written during failure"}`
        )
    }
  );

  await overwriteFile(partial, target);

  // it's ok if the unlink fails
  try {
    await rimraf(partial);
    await rimraf(tmpDir);
  } catch (e) {
    logger.debug(e);
  }

  return result as DownloadResult;
}

async function overwriteFile(sourcePath: string, targetPath: string) {
  // without removing the file first,
  // macOS Gatekeeper can sometimes complain
  // about incorrect binary signature and kill node process
  // https://openradar.appspot.com/FB8914243

  // TODO: this is a temporary revert of https://github.com/prisma/prisma/pull/21439
  // To debug https://github.com/prisma/prisma/pull/21448
  // if (os.platform() === 'darwin') {
  await removeFileIfExists(targetPath);
  // }
  await promises.copyFile(sourcePath, targetPath);
}

async function removeFileIfExists(filePath: string) {
  try {
    await promises.unlink(filePath);
  } catch (e) {
    if ((e as any)?.code !== "ENOENT") {
      throw e;
    }
  }
}
