# esbuild-plugin-node-polyfills

Polyfill node built-in modules with `esbuild`.

## Install

```sh
yarn add -D esbuild-plugin-node-polyfills
```

or

```sh
npm i -D esbuild-plugin-node-polyfills
```

## Usage

Add to your esbuild plugins list:

```js
const esbuild = require("esbuild");
const { nodeBuiltInPolyfillsPlugin } = require("esbuild-plugin-node-polyfills");

esbuild.build({
  ...
  plugins: [
    nodeBuiltInPolyfillsPlugin()
  ]
  ...
});
```
