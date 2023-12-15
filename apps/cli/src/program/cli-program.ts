import { createCLIProgram } from "@storm-stack/cli";

export const createCLIAcidicProgram = async (): Promise<number> => {
  await createCLIProgram({
    name: "acidic",
    description: "Acidic is a Prisma power pack for building full-stack apps.",
    commands: [
      {
        name: "info",
        description:
          "Get information of installed Acidic and related packages.",
        argument: [
          {
            flags: "path",
            description: "project path",
            default: "."
          }
        ],
        action: () => {}
      },
      {
        name: "init",
        description: "Initialize an existing project for Acidic.",
        options: [
          {
            flags: "config",
            description: "config file"
          },
          {
            flags: "package-manager",
            description: "package manager to use"
          },
          {
            flags: "prisma",
            description: "location of Prisma schema file to bootstrap from"
          },
          {
            flags: "tag",
            description:
              "the NPM package tag to use when installing dependencies"
          }
        ],
        argument: [
          {
            flags: "path",
            description: "project path",
            default: "."
          }
        ],
        action: () => {}
      },
      {
        name: "generate",
        description: "Run code generation.",
        options: [
          {
            flags: "schema",
            description: "schema file (with extension .acid)",
            default: {
              value: "./schema.acid"
            }
          },
          {
            flags: "config",
            description: "config file"
          },
          {
            flags: "package-manager",
            description: "package manager to use"
          },
          {
            flags: "no-dependency-check",
            description: "do not check if dependencies are installed"
          }
        ],
        action: () => {}
      }
    ],
    preAction: () => {},
    postAction: () => {}
  });

  return 0;
};

/*

export const initAction = async (
  projectPath: string,
  options: {
    prisma: string | undefined;
    packageManager: PackageManagers | undefined;
    tag?: string;
  }
): Promise<void> => {
  return initProject(
    projectPath,
    options.prisma,
    options.packageManager,
    options.tag
  );
};


export const infoAction = async (projectPath: string): Promise<void> => {
  return dumpInfo(projectPath);
};

export const generateAction = async (options: {
  schema: string;
  packageManager: PackageManagers | undefined;
  dependencyCheck: boolean;
  outDir?: string;
}): Promise<void> => {
  if (options.dependencyCheck) {
    checkRequiredPackage("prisma", requiredPrismaVersion);
    checkRequiredPackage("@prisma/client", requiredPrismaVersion);
  }

  return runPlugins(options);
};

const checkRequiredPackage = (packageName: string, minVersion?: string) => {
  let packageVersion: string;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    packageVersion = require(`${packageName}/package.json`).version;
  } catch (error) {
    console.error(chalk.red(`${packageName} not found, please install it`));
    throw new ProcessingError(`${packageName} not found`);
  }

  if (minVersion && semver.lt(packageVersion, minVersion)) {
    console.error(
      chalk.red(
        `${packageName} needs to be above ${minVersion}, the installed version is ${packageVersion}, please upgrade it`
      )
    );
    throw new ProcessingError(`${packageName} version is too low`);
  }
};

export function createProgram() {
  const program = new Command("acidic");

  program.version(getVersion(), "-v --version", "display CLI version");

  const schemaExtensions = AcidicLanguageMetaData.fileExtensions.join(", ");

  program
    .description(
      `${chalk.bold.blue(
        "⚡"
      )} Acidic is a Prisma power pack for building full-stack apps.\n\nDocumentation: https://acidic.io/docs.`
    )
    .showHelpAfterError()
    .showSuggestionAfterError();

  const schemaOption = new Option(
    "--schema <file>",
    `schema file (with extension ${schemaExtensions})`
  ).default("./schema.acid");

  const configOption = new Option("-c, --config [file]", "config file");

  const pmOption = new Option(
    "-p, --package-manager <pm>",
    "package manager to use"
  ).choices(["npm", "yarn", "pnpm"]);

  const noDependencyCheck = new Option(
    "--no-dependency-check",
    "do not check if dependencies are installed"
  );

  program
    .command("info")
    .description("Get information of installed Acidic and related packages.")
    .argument("[path]", "project path", ".")
    .action(infoAction);

  program
    .command("init")
    .description("Initialize an existing project for Acidic.")
    .addOption(configOption)
    .addOption(pmOption)
    .addOption(
      new Option(
        "--prisma <file>",
        "location of Prisma schema file to bootstrap from"
      )
    )
    .addOption(
      new Option(
        "--tag [tag]",
        "the NPM package tag to use when installing dependencies"
      )
    )
    .argument("[path]", "project path", ".")
    .action(initAction);

  program
    .command("generate")
    .description("Run code generation.")
    .addOption(schemaOption)
    .addOption(configOption)
    .addOption(pmOption)
    .addOption(noDependencyCheck)
    .action(generateAction);

  // make sure config is loaded before actions run
  program.hook("preAction", async (_, actionCommand) => {
    let configFile: string | undefined = actionCommand.opts().config;

    if (!configFile && fs.existsSync(DEFAULT_CONFIG_FILE)) {
      configFile = DEFAULT_CONFIG_FILE;
    }

    if (configFile) {
      loadConfig(configFile);
    }
  });

  return program;
}

export default async function (): Promise<void> {
  const program = createProgram();
  program.exitOverride();

  await program.parseAsync(process.argv);
}*/
