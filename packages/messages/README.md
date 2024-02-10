<!-- START header -->
<!-- END header -->

# Acidic State Management Library

A package containing modules to support server/client RPC communication, caching, and messages management. This package uses [Typia](https://typia.io/) to define types and schemas and [Bentocache](https://bentocache.dev/) to manage the cache's messages.

<!-- START doctoc -->
<!-- END doctoc -->

## Installing

Using [pnpm](http://pnpm.io):

```bash
pnpm add -D @acidic/messages
```

<details>
  <summary>Using npm</summary>

```bash
npm install -D @acidic/messages
```

</details>

<details>
  <summary>Using yarn</summary>

```bash
yarn add -D @acidic/messages
```

</details>

## Reduced Package Size

This project uses [tsup](https://tsup.egoist.dev/) to package the source code due to its ability to remove unused code and ship smaller javascript files thanks to code splitting. This helps to greatly reduce the size of the package and to make it easier to use in other projects.

## Development

This project is built using [Nx](https://nx.dev). As a result, many of the usual commands are available to assist in development.

### Building

Run `nx build messages` to build the library.

### Running unit tests

Run `nx test messages` to execute the unit tests via [Jest](https://jestjs.io).

### Linting

Run `nx lint messages` to run [ESLint](https://eslint.org/) on the package.

<!-- START footer -->
<!-- END footer -->
