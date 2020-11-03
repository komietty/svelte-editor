import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';

export default {
    input: './src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      name: 'svelditor'
    },
    external: [
      'svelte',
      'svelte/store',
    ],
    plugins: [
      svelte(),
      resolve()
    ]
};