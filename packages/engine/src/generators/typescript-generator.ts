import prettierConfig from "@storm-software/linting-tools/prettier/config.json";
import tsconfigBase from "@storm-software/linting-tools/tsconfig/tsconfig.root.json";
import { ErrorCode, StormError } from "@storm-stack/errors";
import { deepMerge } from "@storm-stack/utilities";
import { ESLint } from "eslint";
import { join } from "node:path";
import prettier, { type RequiredOptions } from "prettier";
import {
  type CompilerOptions,
  DiagnosticCategory,
  ModuleKind,
  ModuleResolutionKind,
  Project,
  ScriptTarget,
  type SourceFile
} from "ts-morph";
import type { TypeScriptGeneratorConfig, TypescriptPluginOptions } from "../types";
import { DirectoryTracker } from "./directory-tracker";
import { Generator } from "./generator";

/**
 * Base class for TypeScript generators
 */
export abstract class TypescriptGenerator<
  TOptions extends TypescriptPluginOptions = TypescriptPluginOptions
> extends Generator<TOptions> {
  protected project: Project;
  protected directoryTracker: DirectoryTracker | undefined;
  protected eslint: ESLint;
  protected prettierConfig: prettier.Options;

  public get fileExtension(): string {
    return "ts";
  }

  public get commentStart(): string {
    return "//";
  }

  constructor(
    protected config: TypeScriptGeneratorConfig = {
      compiler: {},
      eslint: {},
      prettier: {}
    }
  ) {
    super();

    this.eslint = new ESLint({
      ...this.config.eslint,
      useEslintrc: true,
      fix: true
    });

    this.project = this.createProject(this.config.compiler);
    this.prettierConfig = deepMerge(prettierConfig, this.config.prettier);
  }

  public async save(options: TOptions) {
    if (this.directoryTracker && options.generateIndexFiles !== false) {
      const indexFiles = this.directoryTracker.getIndexFile();
      for (const indexFile of indexFiles) {
        await this.write(options, indexFile.fileContent, indexFile.fileName);
      }
    }

    const shouldCompile = options.compile !== false;
    if (!shouldCompile || options.preserveTsFiles === true) {
      // save ts files
      await Promise.all(
        this.project.getSourceFiles().map(async (sf) => {
          const extension = [".graphql", ".gql"].includes(sf.getExtension())
            ? "graphql"
            : "typescript";

          if (options.prettier !== false) {
            await this.formatFilePrettier(sf, extension);
          }
        })
      );
      await this.project.save();

      if (options.lint !== false) {
        return await this.formatProjectESLint(options);
      }
    }
    if (shouldCompile) {
      const errors = this.project
        .getPreEmitDiagnostics()
        .filter((d) => d.getCategory() === DiagnosticCategory.Error);
      if (errors.length > 0) {
        this.context?.logger.error("Error compiling generated code:");
        this.context?.logger.error(
          this.project.formatDiagnosticsWithColorAndContext(errors.slice(0, 10))
        );
        await this.project.save();

        throw new StormError(ErrorCode.processing_error, {
          message: "Error compiling generated code"
        });
      }

      const result = await this.project.emit();

      const emitErrors = result
        .getDiagnostics()
        .filter((d) => d.getCategory() === DiagnosticCategory.Error);
      if (emitErrors.length > 0) {
        this.context?.logger.error("Some generated code is not emitted:");
        this.context?.logger.error(
          this.project.formatDiagnosticsWithColorAndContext(emitErrors.slice(0, 10))
        );
        await this.project.save();
        throw new StormError(ErrorCode.processing_error, {
          message: "Error compiling generated code"
        });
      }

      if (options.lint !== false) {
        return await this.formatProjectESLint(options);
      }
    }
  }

  /*protected async lintFile(sf: SourceFile): Promise<Linter.FixReport> {
    const text = await readFile(sf.getFilePath(), { encoding: "utf8" });
    return this.linter.verifyAndFix(text, this.config.eslint, { fix: true });
  }

  protected async lintString(text: string): Promise<Linter.FixReport> {
    return this.linter.verifyAndFix(text, this.config.eslint, { fix: true });
  }*/

  protected async innerWrite(
    options: TOptions,
    fileContent: string,
    fileName: string,
    fileExtension = this.fileExtension
  ) {
    const extension =
      fileExtension === "*"
        ? ""
        : fileExtension.startsWith(".")
          ? fileExtension
          : `.${fileExtension}`;

    const filePath = join(
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      options.output!,
      fileName.endsWith(extension) ? fileName : `${fileName}${extension}`
    );

    if (options.prettier !== false) {
      await this.formatFilePrettier(
        this.project.createSourceFile(filePath, fileContent, {
          overwrite: true
        }),
        this.getParserFromExtension(extension)
      );
    }

    if (options.generateIndexFiles !== false) {
      this.directoryTracker ??= new DirectoryTracker("/");
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      this.directoryTracker.addFile(filePath.replace(options.output!, ""));
    }
  }

  protected getParserFromExtension(extension: string): string {
    switch (extension) {
      case ".ts":
      case ".tsx":
        return "typescript";
      case ".js":
      case ".jsx":
        return "babel";
      case ".json":
        return "json";
      case ".gql":
      case ".graphql":
        return "graphql";
      default:
        return "typescript";
    }
  }

  /**
   * Creates a TS code generation project
   *
   * @param options The compiler options
   * @returns The generated project object
   */
  private createProject(options?: CompilerOptions): Project {
    return new Project({
      ...tsconfigBase,
      compilerOptions: {
        ...tsconfigBase.compilerOptions,
        moduleResolution: ModuleResolutionKind.Node10,
        target: ScriptTarget.ES2022,
        module: ModuleKind.CommonJS,
        esModuleInterop: true,
        declaration: true,
        strict: true,
        skipLibCheck: true,
        ...options
      }
    });
  }

  /**
   * Format the project using ESLint
   *
   * @param options The plugin options
   */
  private async formatProjectESLint(options: TOptions) {
    this.context?.logger.info("1. Create an instance.");
    // 1. Create an instance.

    this.context?.logger.info("2. Lint files.");
    // 2. Lint files.
    const results = await this.eslint.lintFiles([`${options.output}/**/*.ts`]);
    await ESLint.outputFixes(results);

    this.context?.logger.info("3. Format the results..");
    // 3. Format the results.
    const formatter = await this.eslint.loadFormatter("stylish");
    const resultText = await Promise.resolve(formatter.format(results));
    this.context?.logger.info(resultText);

    this.context?.logger.info("4. Done Lint files.");
  }

  /**
   * Format a file using prettier
   *
   * @param sourceFile The source file to format
   * @param parser The parser to use
   */
  private async formatFilePrettier(sourceFile: SourceFile, parser = "typescript") {
    try {
      const formatted = await this.formatStringPrettier(sourceFile.getFullText(), parser);

      sourceFile.replaceWithText(formatted);
      await sourceFile.save();
    } catch {
      /* empty */
    }
  }

  /**
   * Format a string using prettier
   *
   * @param content The string content to format
   * @param parser The parser to use
   */

  private formatStringPrettier = (content: string, parser = "typescript"): Promise<string> => {
    try {
      return prettier.format(content, {
        ...prettierConfig,
        ...this.prettierConfig,
        parser
      } as Partial<RequiredOptions>);
    } catch (e) {
      this.context?.logger.error("Error formatting file");
      this.context?.logger.error(e);

      return Promise.resolve(content);
    }
  };
}
