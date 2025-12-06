import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export function getHash(filePath: string): Promise<string> {
  const hash = createHash("sha256");
  const input = createReadStream(filePath);
  return new Promise(resolve => {
    input.on("readable", () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        resolve(hash.digest("hex"));
      }
    });
  });
}
