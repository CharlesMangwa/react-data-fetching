/* eslint import/no-extraneous-dependencies: 0 */

import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import uglify from 'rollup-plugin-uglify'

const getPlugins = (env) => {
  const plugins = [resolve()]

  if (env) {
    plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env),
      }),
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
            },
          },
        ],
        'stage-1',
        'flow',
        'react',
      ],
      plugins: ['external-helpers'].concat(
        env === 'production'
          ? [
            'dev-expression',
            'transform-react-remove-prop-types',
            'transform-flow-strip-types',
          ]
          : [],
      ),
    }),
    commonjs({
      include: /node_modules/,
    }),
  )

  if (env === 'production')
    plugins.push(uglify())

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
