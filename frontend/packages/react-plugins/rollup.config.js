// Copyright (c) 2025 NTT InfraNet
import pkg from './package.json'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default [
  {
    input: 'src/index.js',
    external: ['react', 'reselect', '@reach/router', '@ehv/react-slots'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      resolve(),
      commonjs({ include: 'node_modules/**' }),
      babel({ exclude: ['node_modules/**'] })
    ]
  }
]
