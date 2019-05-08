/* eslint import/no-extraneous-dependencies: 0 */

import { terser } from "rollup-plugin-terser"
import babel from "rollup-plugin-babel"
import commonjs from "rollup-plugin-commonjs"
import replace from "rollup-plugin-replace"
import resolve from "rollup-plugin-node-resolve"

const getPlugins = env => {
  const plugins = [resolve()]

  if (env) {
    plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(env),
      })
    )
  }

  plugins.push(
    babel({
      exclude: "node_modules/**",
      babelrc: false,
      presets: [
        [
          "@babel/preset-env",
          {
            loose: true,
            modules: false,
            targets: {
              node: "current",
              browsers: "> 1%, last 2 versions",
            },
          },
        ],
        "@babel/preset-flow",
        "@babel/preset-react",
      ],
      plugins: [
        "dev-expression",
        ["@babel/plugin-transform-runtime", { helpers: false }],
        "@babel/plugin-syntax-dynamic-import",
        "@babel/plugin-syntax-import-meta",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-json-strings",
        [
          "@babel/plugin-proposal-decorators",
          {
            legacy: true,
          },
        ],
        "@babel/plugin-proposal-function-sent",
        "@babel/plugin-proposal-export-namespace-from",
        "@babel/plugin-proposal-numeric-separator",
        "@babel/plugin-proposal-throw-expressions",
        "@babel/plugin-proposal-export-default-from",
        "@babel/plugin-proposal-logical-assignment-operators",
        "@babel/plugin-proposal-optional-chaining",
        [
          "@babel/plugin-proposal-pipeline-operator",
          {
            proposal: "minimal",
          },
        ],
        "@babel/plugin-proposal-nullish-coalescing-operator",
        "@babel/plugin-proposal-do-expressions",
      ].concat(
        env === "production" ? ["transform-react-remove-prop-types"] : []
      ),
    }),
    commonjs({
      include: /node_modules/,
    })
  )

  if (env === "production") plugins.push(terser())

  return plugins
}

const config = {
  input: "modules/index.js",
  output: {
    globals: {
      react: "React",
    },
  },
  external: ["react"],
  plugins: getPlugins(process.env.BUILD_ENV),
}

module.exports = config
