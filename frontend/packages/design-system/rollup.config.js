// Copyright (c) 2025 NTT InfraNet
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import flowEntry from 'rollup-plugin-flow-entry'

export default [
  {
    input: 'src/index.js',
    external: ['react', 'prop-types', 'styled-components', 'styled-system'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      commonjs({ include: /node_modules/ }),
      flowEntry(),
      babel({ runtimeHelpers: true })
    ]
  }
]
