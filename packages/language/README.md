<!-- START header -->
<!-- END header -->

# Acidic Language Tools

The 🧪 Acidic language tools are used to create schemas for your business models and generate static code based on those models. This package supports using Acidic in Visual Studio Code for local development. This language definition is used by the Acidic Language Server to provide support for other Acidic tools (CLI, Nx Plugins, etc.). Included is the specification of the syntax and semantics of Acidic.

<!-- START doctoc -->
<!-- END doctoc -->

## Reduced Package Size

This project uses [tsup](https://tsup.egoist.dev/) to package the source code due to its ability to remove unused code and ship smaller javascript files thanks to code splitting. This helps to greatly reduce the size of the package and to make it easier to use in other projects.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual commands are available to assist in development.

### Building

Run `nx build language` to build the library.

### Running unit tests

Run `nx test language` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint language` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- END footer -->
