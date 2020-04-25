# never-exit

Library to ensure your Node processes never exit by themselves.

## Usage

```js
const neverExit = require("never-exit");

/**
 * Returns a function to allow the process to exit.
 */
const exit = neverExit();

...

exit();
```

## Developing

### Install

```console
yarn install --frozen-lockfile
```

### Build

```console
yarn build
```

### Test

Unit tests:

```console
yarn test
```

Integration tests (ensure assets have been built first):

```console
yarn test:int
```

### Lint

```console
yarn lint
```

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [CHANGELOG](./docs/CHANGELOG.md) docs.
