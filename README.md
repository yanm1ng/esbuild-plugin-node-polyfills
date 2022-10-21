# esbuild-plugin-node-builtin-polyfills

Polyfill node builtin modules with `esbuild`.

## Install

```sh
yarn add -D esbuild-plugin-node-builtin-polyfills
```

or

```sh
npm i -D esbuild-plugin-node-builtin-polyfills
```

## Usage

Add to your esbuild plugins list:

```js
const esbuild = require("esbuild");
const { nodeBuiltInPolyfillsPlugin } = require("esbuild-plugin-node-builtin-polyfills");

esbuild.build({
  ...
  plugins: [
    nodeBuiltInPolyfillsPlugin()
  ]
  ...
});
```
