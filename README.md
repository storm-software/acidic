<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/acidic-banner.gif" width="100%" alt="Acidic" /></div>

<br />
<div align="center">
<a href="https://acidic.io" target="_blank">Website</a>  |  <a href="https://acidic.io/contact" target="_blank">Contact</a>  |  <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=bug&template=bug-report.yml&title=Bug Report%3A+">Report a Bug</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=enhancement&template=feature-request.yml&title=Feature Request%3A+">Request a Feature</a> | <a href="https://github.com/storm-software/storm-ops/issues/new?assignees=&labels=documentation&template=documentation.yml&title=Documentation Request%3A+">Request Documentation</a> | <a href="https://github.com/storm-software/storm-ops/discussions">Ask a Question</a>
</div>

<br />
🧪 <b>Acidic</b> is a modeling tool that can be used to describe and generate code for API end points, database tables, type definitions, client components, and so much more!
<br /><br />

⚡<b>Storm Workspaces</b> are built using <a href="https://nx.dev/" target="_blank">Nx</a>, a set of extensible dev tools for monorepos, which helps you develop like Google, Facebook, and Microsoft. Building on top of Nx, the Open System provides a set of tools and patterns that help you scale your monorepo to many teams while keeping the codebase maintainable.

<h3 align="center">💻 Visit <a href="https://stormsoftware.org" target="_blank">stormsoftware.org</a> to stay up to date with this developer</h3><br />

[![github](https://img.shields.io/github/package-json/v/storm-software/storm-ops?style=for-the-badge&color=1fb2a6)](https://github.com/storm-software/storm-ops)&nbsp;[![Nx](https://img.shields.io/badge/Nx-17.0.2-lightgrey?style=for-the-badge&logo=nx&logoWidth=20&&color=1fb2a6)](http://nx.dev/)&nbsp;[![NextJs](https://img.shields.io/badge/Next.js-14.0.2-lightgrey?style=for-the-badge&logo=nextdotjs&logoWidth=20&color=1fb2a6)](https://nextjs.org/)&nbsp;[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge&logo=commitlint&color=1fb2a6)](http://commitizen.github.io/cz-cli/)&nbsp;![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge&color=1fb2a6)&nbsp;![documented with docusaurus](https://img.shields.io/badge/documented_with-docusaurus-success.svg?style=for-the-badge&logo=readthedocs&color=1fb2a6)&nbsp;![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/storm-software/storm-ops/cr.yml?style=for-the-badge&logo=github-actions&color=1fb2a6)

> [!IMPORTANT]
> This repository, and the apps, libraries, and tools contained within, is still in it's initial development phase. As a result, bugs and issues are expected with it's usage. When the main development phase completes, a proper release will be performed, the packages will be availible through NPM (and other distributions), and this message will be removed. However, in the meantime, please feel free to report any issues you may come across.

<br />

<!--#if GitHubActions-->

[![GitHub Actions Build History](https://buildstats.info/github/chart/storm-software/storm-ops?branch=main&includeBuildsFromPullRequest=false)](https://github.com/storm-software/storm-ops/actions)

<!--#endif-->

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Quick Features](#quick-features)
- [Model-Driven Development](#acidic---model-driven-development)
  - [Visual Studio Code Extension](#visual-studio-code-extension)
  - [Development](#development)
  - [Getting Started](#getting-started)
    - [Build](#build)
    - [Development Server](#development-server)
    - [Generate an Application](#generate-an-application)
    - [Generate a Library](#generate-a-library)
    - [Code Scaffolding](#code-scaffolding)
    - [Testing](#testing)
      - [Running Unit Tests](#running-unit-tests)
    - [Running End-to-End Tests](#running-end-to-end-tests)
    - [Understand your workspace](#understand-your-workspace)
    - [☁ Nx Cloud](#-nx-cloud)
  - [Distributed Computation Caching \& Distributed Task Execution](#distributed-computation-caching--distributed-task-execution)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Contributors ✨](#contributors-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<br />

## Quick Features

Some of the features of **Acidic** include the following:

- Describe your whole service in a single model, but allow for fined grained control (database structure, Api requests/response, validations, auth, etc.)
- Generate code for your entire service from a single model
- Visual Studio Code extension
- CLI tools to drive processing
- Nx plugins for an improved development experience

## Model-Driven Development

**Acidic** refers to a collection of applications and libraries that are used to build server-side code from a user-defined model. The specification for this language can be found in the monorepo's [language package](/packages/language/).

<div align="center"><img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/acidic-generate-flow.png" width="800px" alt="Acidic Engine flow diagram" /></div>
<br />

More information can be found in the [📓 Documentation](https://acidic.io/docs).
<br />

## Visual Studio Code Extension

**Acidic** has it's own Visual Studio Code extension to support the language model in the IDE. The extension can be found in the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=storm-software.acidic).

# Roadmap

See the [open issues](https://github.com/storm-software/storm-ops/issues) for a list of proposed features (and known issues).

- [Top Feature Requests](https://github.com/storm-software/storm-ops/issues?q=label%3Aenhancement+is%3Aopen+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Top Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aissue+is%3Aopen+label%3Abug+sort%3Areactions-%2B1-desc) (Add your votes using the 👍 reaction)
- [Newest Bugs](https://github.com/storm-software/storm-ops/issues?q=is%3Aopen+is%3Aissue+label%3Abug)
  <br /><br />

# Contributing

First off, thanks for taking the time to contribute! Contributions are what makes the open-source community such an amazing place to learn, inspire, and create. Any contributions you make will benefit everybody else and are **greatly appreciated**.

Please try to create bug reports that are:

- _Reproducible._ Include steps to reproduce the problem.
- _Specific._ Include as much detail as possible: which version, what environment, etc.
- _Unique._ Do not duplicate existing opened issues.
- _Scoped to a Single Bug._ One bug per report.

Please adhere to this project's [code of conduct](.github/CODE_OF_CONDUCT.md).

You can use [markdownlint-cli](https://github.com/storm-software/storm-ops/markdownlint-cli) to check for common markdown style inconsistency.
<br /><br />

# Support

Reach out to the maintainer at one of the following places:

- [Contact](https://stormsoftware.org/contact)
- [GitHub discussions](https://github.com/storm-software/storm-ops/discussions)
- <contact@stormsoftware.org>

# License

This project is licensed under the **Apache License 2.0**. Feel free to edit and distribute this template as you like. If you have any specific questions, please reach out to the Storm Software development team.

See [LICENSE](LICENSE) for more information.

# Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.sullypat.com/"><img src="https://avatars.githubusercontent.com/u/99053093?v=4?s=100" width="100px;" alt="Patrick Sullivan"/><br /><sub><b>Patrick Sullivan</b></sub></a><br /><a href="#design-sullivanpj" title="Design">🎨</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Code">💻</a> <a href="#tool-sullivanpj" title="Tools">🔧</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Documentation">📖</a> <a href="https://github.com/storm-software/storm-ops/commits?author=sullivanpj" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://tylerbenning.com/"><img src="https://avatars.githubusercontent.com/u/7265547?v=4?s=100" width="100px;" alt="Tyler Benning"/><br /><sub><b>Tyler Benning</b></sub></a><br /><a href="#design-tbenning" title="Design">🎨</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://stormsoftware.org"><img src="https://avatars.githubusercontent.com/u/149802440?v=4?s=100" width="100px;" alt="Stormie"/><br /><sub><b>Stormie</b></sub></a><br /><a href="#maintenance-stormie-bot" title="Maintenance">🚧</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<br />
<br />
<div align="center">
<img src="https://pub-761b436209f44a4d886487c917806c08.r2.dev/storm-banner.gif" width="90%" alt="Storm Software" />
</div>

<br />
<div align="center">
<a href="https://stormsoftware.org" target="_blank">Website</a>  |  <a href="https://stormsoftware.org/contact" target="_blank">Contact</a>  |  <a href="https://linkedin.com/in/patrick-sullivan-865526b0" target="_blank">LinkedIn</a>  |  <a href="https://medium.com/@pat.joseph.sullivan" target="_blank">Medium</a>  | <a href="https://github.com/storm-software" target="_blank">GitHub</a>  |  <a href="https://keybase.io/sullivanp" target="_blank">OpenPGP Key</a>
</div>

<div align="center">
<p><b>Fingerprint:</b> 1BD2 7192 7770 2549 F4C9 F238 E6AD C420 DA5C 4C2D</p>
</div>
<br />

**Storm Software** is an open source software development organization and creator of Acidic, StormStack and StormCloud. Our mission is to make software development more accessible. Our ideal future is one where anyone can create software without years of prior development experience serving as a barrier to entry. We hope to achieve this via LLMs, Generative AI, and intuitive, high-level data modeling/programming languages.

If this sounds interesting, and you would like to help us in creating the next generation of development tools, please reach out on our [website](https://stormsoftware.org)!

<h3 align="center">💻 Visit <a href="https://stormsoftware.org" target="_blank">stormsoftware.org</a> to stay up to date with this developer</h3><br /><br />
