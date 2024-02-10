/**
 * Masks the urls in a schema file.
 *
 * @param schema - The schema to mask
 * @returns The masked schema
 */
export function maskSchemaUrls(schema: string): string {
  const regex = /url\s*=\s*.+/;
  return schema
    .split("\n")
    .map((line) => {
      const match = regex.exec(line);
      if (match) {
        return `${line.slice(0, match.index)}url = "***"`;
      }
      return line;
    })
    .join("\n");
}
