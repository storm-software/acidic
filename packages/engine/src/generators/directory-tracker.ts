import { findFileName, findFilePath } from "@storm-stack/file-system";
import { NEWLINE_STRING } from "@storm-stack/utilities";
import { join } from "path";

export type DirectoryTrackerFile = {
  fullPath: string;
  name: string;
};

export type DirectoryTrackerIndexFile = {
  fileContent: string;
  fileName: string;
};

/**
 * Definition for DirectoryTracker class
 */
export class DirectoryTracker {
  #files: DirectoryTrackerFile[];
  #childDirectories: DirectoryTracker[];
  #directoryPath: string;

  constructor(
    directoryPath: string,
    private _includedExtensions: string[] = ["ts", "tsx", "js", "jsx"]
  ) {
    this.#files = [];
    this.#childDirectories = [];

    this.#directoryPath = directoryPath.replaceAll(/\\/g, "/");
  }

  public get __base(): string {
    return "DirectoryTracker";
  }

  public get files(): DirectoryTrackerFile[] {
    return this.#files;
  }

  public get directoryPath(): string {
    return this.#directoryPath;
  }

  public addFile = (filePath: string) => {
    const directoryPath = findFilePath(filePath);
    const name = findFileName(filePath);
    if (
      !this._includedExtensions.includes(name.split(".").pop()!) ||
      name === "index.ts"
    ) {
      return;
    }

    let relativePath = directoryPath
      .replaceAll(/\\/g, "/")
      .replace(this.#directoryPath, "");
    if (!relativePath || relativePath === "/") {
      this.#files.push({
        fullPath: filePath,
        name
      });
    } else if (relativePath) {
      if (
        !this.#childDirectories.some(
          childDirectory => childDirectory.directoryPath === relativePath
        )
      ) {
        this.#childDirectories.push(
          new DirectoryTracker(relativePath, this._includedExtensions)
        );
      }

      this.#childDirectories
        .find(childDirectory => childDirectory.directoryPath === relativePath)
        ?.addFile(filePath);
    }
  };

  public getIndexFile = (
    indexFiles: DirectoryTrackerIndexFile[] = []
  ): DirectoryTrackerIndexFile[] => {
    if (this.#files.length === 0 && this.#childDirectories.length === 0) {
      return indexFiles;
    }

    indexFiles.push({
      fileContent:
        this.#files
          .map(
            file => `export * from "./${this.removeFileExtension(file.name)}";`
          )
          .join(NEWLINE_STRING) +
        NEWLINE_STRING +
        this.#childDirectories
          .map(
            childDirectory =>
              `export * from "./${childDirectory.directoryPath}";`
          )
          .join(NEWLINE_STRING),
      fileName: join(this.#directoryPath, "index.ts")
    });

    return this.#childDirectories.reduce(
      (ret: DirectoryTrackerIndexFile[], childDirectory: DirectoryTracker) => {
        return childDirectory.getIndexFile(ret);
      },
      indexFiles
    );
  };

  private removeFileExtension = (name: string): string => {
    return this._includedExtensions.reduce((ret, extension) => {
      if (ret.endsWith(`.${extension}`)) {
        return ret.replace(`.${extension}`, "");
      }

      return ret;
    }, name);
  };
}
