import { Plugin, PluginBuild } from 'esbuild';
import fs from 'fs';
import path from 'path';

// copy from https://github.com/sindresorhus/builtin-modules/blob/main/builtin-modules.json
export const builtInModules = [
  'assert',
  'async_hooks',
  'buffer',
  'child_process',
  'cluster',
  'console',
  'constants',
  'crypto',
  'dgram',
  'diagnostics_channel',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'string_decoder',
  'timers',
  'tls',
  'trace_events',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'wasi',
  'worker_threads',
  'zlib',
].reduce<string[]>((pv, cv) => pv.concat([cv, `node:${cv}`]), []);

const builtInPolyfills = {
  process: require.resolve(
    'rollup-plugin-node-polyfills/polyfills/process-es6'
  ),
  buffer: require.resolve('rollup-plugin-node-polyfills/polyfills/buffer-es6'),
  util: require.resolve('rollup-plugin-node-polyfills/polyfills/util'),
  sys: require.resolve('rollup-plugin-node-polyfills/polyfills/util'),
  events: require.resolve('rollup-plugin-node-polyfills/polyfills/events'),
  stream: require.resolve('rollup-plugin-node-polyfills/polyfills/stream'),
  path: require.resolve('rollup-plugin-node-polyfills/polyfills/path'),
  punycode: require.resolve('rollup-plugin-node-polyfills/polyfills/punycode'),
  url: require.resolve('rollup-plugin-node-polyfills/polyfills/url'),
  http: require.resolve('rollup-plugin-node-polyfills/polyfills/http'),
  string_decoder: require.resolve(
    'rollup-plugin-node-polyfills/polyfills/string-decoder'
  ),
  os: require.resolve('rollup-plugin-node-polyfills/polyfills/os'),
  assert: require.resolve('rollup-plugin-node-polyfills/polyfills/assert'),
  constants: require.resolve(
    'rollup-plugin-node-polyfills/polyfills/constants'
  ),
  timer: require.resolve('rollup-plugin-node-polyfills/polyfills/timers'),
  vm: require.resolve('rollup-plugin-node-polyfills/polyfills/vm'),
  zlib: require.resolve('rollup-plugin-node-polyfills/polyfills/zlib'),
  tty: require.resolve('rollup-plugin-node-polyfills/polyfills/tty'),
  domain: require.resolve('rollup-plugin-node-polyfills/polyfills/domain'),
  querystring: require.resolve('rollup-plugin-node-polyfills/polyfills/qs'),
  // crypto: require.resolve('crypto-browserify'),
};

const namespace = 'node-polyfills-plugin';

/**
 *
 * @export
 * @returns {Plugin}
 */
export function nodeBuiltInPolyfillsPlugin(): Plugin {
  return {
    name: namespace,
    setup(build: PluginBuild) {
      // check globalThis
      if (
        build.initialOptions?.define &&
        !build.initialOptions.define?.global
      ) {
        build.initialOptions.define.global = 'globalThis';
      } else if (!build.initialOptions?.define) {
        build.initialOptions.define = { global: 'globalThis' };
      }

      build.onResolve(
        {
          filter: new RegExp('^(' + builtInModules.join('|') + ')$'),
        },
        async (args) => {
          try {
            const pkg = args.path.replace(/^node:/, '');
            if (Object.keys(builtInPolyfills).includes(pkg)) {
              const polyfillResolvePath = builtInPolyfills[pkg];
              return {
                path: args.path,
                namespace,
                pluginData: {
                  resolveDir: path.dirname(polyfillResolvePath),
                  polyfillResolvePath,
                },
              };
            }

            throw new Error(
              'Could not resolve built-in module ' +
                pkg +
                ', use empty Object to mock'
            );
          } catch (err: any) {
            console.warn(err.message);
            return {
              path: args.path,
              namespace,
              pluginData: {
                resolveDir: args.resolveDir,
                polyfillResolvePath: require.resolve(
                  'rollup-plugin-node-polyfills/polyfills/empty'
                ),
              },
            };
          }
        }
      );

      build.onLoad(
        {
          filter: /.*/,
          namespace,
        },
        async (args) => {
          const { resolveDir, polyfillResolvePath } = args.pluginData || {};
          const contents = fs.readFileSync(polyfillResolvePath, 'utf-8');
          return {
            resolveDir,
            loader: 'js',
            contents: contents,
          };
        }
      );
    },
  };
}
