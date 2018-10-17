/* eslint import/no-extraneous-dependencies: 0 */

import { terser } from 'rollup-plugin-terser'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'

const getPlugins = env => {
  const plugins = [resolve()]

  if (env) {
    plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      })
    )
  }

  plugins.push(
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        [
          'env',
          {
            loose: true,
            modules: false,
            targets: {
              node: 'current',
              browser: '> 1%, last 2 versions',
            },
          },
        ],
        'stage-1',
        'flow',
        'react',
      ],
      plugins: [
        'external-helpers',
        'dev-expression',
        [
          'transform-runtime',
          {
            helpers: false,
            polyfill: false,
            regenerator: true,
          },
        ],
      ].concat(
        env === 'production'
          ? [
              'dev-expression',
              'transform-react-remove-prop-types',
              'transform-flow-strip-types',
            ]
          : []
      ),
    }),
    commonjs({
      include: /node_modules/,
    })
  )

  if (env === 'production') plugins.push(terser())

  return plugins
}

const config = {
  input: 'modules/index.js',
  output: {
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
  plugins: getPlugins(process.env.BUILD_ENV),
}

module.exports = config
