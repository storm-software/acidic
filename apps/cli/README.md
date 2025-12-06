<!-- START header -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/acidic-banner.gif" width="100%" alt="Acidic" /></div>

<br />
<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  |  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  |  <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=enhancement&template=feature-request.yml&title=Feature Request%3A+">Request a Feature</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=documentation&template=documentation.yml&title=Documentation Request%3A+">Request Documentation</a> | <a href="https://github.com/storm-software/storm-ops/discussions">Ask a Question</a>
</div>

<br />
🧪 <b>Acidic</b> is a modeling tool that can be used to describe and generate code for API end points, database tables, type definitions, client components, and so much more!
<br /><br />

⚡<b>Storm Workspaces</b> are built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft. Building on top of Nx, the Open System provides a set of tools and patterns that help you scale your monorepo to many teams while keeping the codebase maintainable.

<h3 align="center">💻 Visit <a href="https://acidic.io" target="_blank">acidic.io</a> to stay up to date with this developer</h3><br />

[![Version](https://img.shields.io/badge/version-0.0.1-1fb2a6.svg?style=for-the-badge&color=1fb2a6)](https://prettier.io/)&nbsp;
[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![Semantic-Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;[![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)](https://docusaurus.io/)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

> [!IMPORTANT]
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END header -->

# Acidic CLI Application

Package containing the Acidic Engine command line interface

<!-- toc -->

- [Acidic CLI Application](#acidic-cli-application)
- [Usage](#usage)
- [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @acidic/cli
$ acidic COMMAND
running command...
$ acidic (--version)
@acidic/cli/0.0.1 win32-x64 node-v20.11.0
$ acidic --help [COMMAND]
USAGE
  $ acidic COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`acidic hello PERSON`](#acidic-hello-person)
- [`acidic hello world`](#acidic-hello-world)
- [`acidic help [COMMAND]`](#acidic-help-command)
- [`acidic plugins`](#acidic-plugins)
- [`acidic plugins add PLUGIN`](#acidic-plugins-add-plugin)
- [`acidic plugins:inspect PLUGIN...`](#acidic-pluginsinspect-plugin)
- [`acidic plugins install PLUGIN`](#acidic-plugins-install-plugin)
- [`acidic plugins link PATH`](#acidic-plugins-link-path)
- [`acidic plugins remove [PLUGIN]`](#acidic-plugins-remove-plugin)
- [`acidic plugins reset`](#acidic-plugins-reset)
- [`acidic plugins uninstall [PLUGIN]`](#acidic-plugins-uninstall-plugin)
- [`acidic plugins unlink [PLUGIN]`](#acidic-plugins-unlink-plugin)
- [`acidic plugins update`](#acidic-plugins-update)

## `acidic hello PERSON`

Say hello

```
USAGE
  $ acidic hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.js](https://github.com/storm-software/acidic/blob/v0.0.1/dist/commands/hello/index.js)_

## `acidic hello world`

Say hello world

```
USAGE
  $ acidic hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ acidic hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.js](https://github.com/storm-software/acidic/blob/v0.0.1/dist/commands/hello/world.js)_

## `acidic help [COMMAND]`

Display help for acidic.

```
USAGE
  $ acidic help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for acidic.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.0.20/src/commands/help.ts)_

## `acidic plugins`

List installed plugins.

```
USAGE
  $ acidic plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ acidic plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/index.ts)_

## `acidic plugins add PLUGIN`

Installs a plugin into acidic.

```
USAGE
  $ acidic plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into acidic.

  Uses bundled npm executable to install plugins into C:\Users\patjo\AppData\Local\acidic

  Installation of a user-installed plugin will override a core plugin.

  Use the ACIDIC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ACIDIC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ acidic plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ acidic plugins add myplugin

  Install a plugin from a github url.

    $ acidic plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ acidic plugins add someuser/someplugin
```

## `acidic plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ acidic plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ acidic plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/inspect.ts)_

## `acidic plugins install PLUGIN`

Installs a plugin into acidic.

```
USAGE
  $ acidic plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into acidic.

  Uses bundled npm executable to install plugins into C:\Users\patjo\AppData\Local\acidic

  Installation of a user-installed plugin will override a core plugin.

  Use the ACIDIC_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the ACIDIC_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ acidic plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ acidic plugins install myplugin

  Install a plugin from a github url.

    $ acidic plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ acidic plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/install.ts)_

## `acidic plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ acidic plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a
  linked plugin with a 'hello' command will override the user-installed or core plugin
  implementation. This is useful for development work.


EXAMPLES
  $ acidic plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/link.ts)_

## `acidic plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ acidic plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ acidic plugins unlink
  $ acidic plugins remove

EXAMPLES
  $ acidic plugins remove myplugin
```

## `acidic plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ acidic plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to
               uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/reset.ts)_

## `acidic plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ acidic plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ acidic plugins unlink
  $ acidic plugins remove

EXAMPLES
  $ acidic plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/uninstall.ts)_

## `acidic plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ acidic plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ acidic plugins unlink
  $ acidic plugins remove

EXAMPLES
  $ acidic plugins unlink myplugin
```

## `acidic plugins update`

Update installed plugins.

```
USAGE
  $ acidic plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.0.1/src/commands/plugins/update.ts)_

<!-- commandsstop -->

## Reduced Package Size

This project uses [tsup](https://tsup.egoist.dev/) to package the source code due to its ability to remove unused code and ship smaller javascript files thanks to code splitting. This helps to greatly reduce the size of the package and to make it easier to use in other projects.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual commands are available to assist in development.

### Building

Run `nx build cli` to build the library.

### Running unit tests

Run `nx test cli` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint cli` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


## Quick Features

Some of the features of **Acidic** include the following:

- Describe your whole service in a single model, but allow for fined grained control (database structure, Api requests/response, validations, auth, etc.)
- Generate code for your entire service from a single model
- Visual Studio Code extension
- CLI tools to drive processing
- Nx plugins for an improved development experience

## Model-Driven Development

**Acidic** refers to a collection of applications and libraries that are used to build server-side code from a user-defined model. The specification for this language can be found in the monorepo's [language package](/packages/language/).

<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/acidic-generate-flow.png" width="800px" alt="Acidic Engine flow" /></div>
<br />

More information can be found in the [📓 Acidic Documentation](https://acidic.io/docs).
<br />

## Storm Workspaces

Storm workspaces are built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft. Building on top of Nx, the Open System provides a set of tools and patterns that help you scale your monorepo to many teams while keeping the codebase maintainable.

## Roadmap

See the [open issues](https://github.com/storm-software/acidic/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/acidic/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/acidic/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/acidic/issues?q=is%3Aopen+is%3Aissue+label%3Abug)

## Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.com/contact)
- [GitHub discussions](https://github.com/storm-software/acidic/discussions)
- <support@stormsoftware.com>

## License

This project is licensed under the **Apache License 2.0**. Feel free to edit and distribute this template as you like.

See [LICENSE](LICENSE) for more information.

## Changelog

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html). Every release, along with the migration instructions, is documented in the [CHANGELOG](CHANGELOG.md) file

## Contributing

First off, thanks for taking the time to contribute! Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Please adhere to this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

You can use [markdownlint-cli](https://github.com/storm-software/acidic/markdownlint-cli) to check for common markdown style inconsistency.

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stormsoftware.com"><img src="https://avatars.githubusercontent.com/u/149802440?v=4?s=100" width="100px;" alt="Stormie"/><br /><sub><b>Stormie</b></sub></a><br /><a href="#maintenance-stormie-bot" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg" alt="all-contributors logo">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<br />
<br />
<div align="center">
<img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/storm-banner.gif" width="90%" alt="Storm Software" />
</div>

<br />
<div align="center">
<a href="https://stormsoftware.com" target="_blank">Website</a>  |  <a href="https://stormsoftware.com/contact" target="_blank">Contact</a>  |  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  |  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  | <a href="https://github.com/storm-software" target="_blank">GitHub</a>  |  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<p><b>Fingerprint:</b> 1BD2 7192 7770 2549 F4C9 F238 E6AD C420 DA5C 4C2D</p>
</div>
<br />

**Storm Software** is an open source software development organization and creator of Acidic, StormStack and StormCloud. Our mission is to make software development more accessible. Our ideal future is one where anyone can create software without years of prior development experience serving as a barrier to entry. We hope to achieve this via LLMs, Generative AI, and intuitive, high-level data modeling/programming languages.

If this sounds interesting, and you would like to help us in creating the next generation of development tools, please reach out on our [website](https://stormsoftware.com)!

<h3 align="center">💻 Visit <a href="https://stormsoftware.com" target="_blank">stormsoftware.com</a> to stay up to date with this developer</h3><br /><br />


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- END footer -->
