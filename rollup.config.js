//import svelte from 'rollup-plugin-svelte';
//import resolve from 'rollup-plugin-node-resolve';
//import pkg from './package.json';
//import sveltePreprocess from 'svelte-preprocess';
//import typescript from '@rollup/plugin-typescript';

//export default {
    //input: './src/index.js',
    //output: {
      //file: pkg.main,
      //format: 'cjs',
      //name: 'svelditor'
    //},
    //external: [
      //'svelte',
      //'svelte/store',
    //],
    //plugins: [
      //svelte({
        //preprocess: sveltePreprocess(),
      //}),
      //resolve({
        //browser: true,
        //dedupe: ['svelte']
      //}),
      //typescript({
        //sourceMap: false,
        //inlineSources: false
      //}),
    //]
//};

import svelte from "rollup-plugin-svelte"
import commonjs from "@rollup/plugin-commonjs"
import resolve from "@rollup/plugin-node-resolve"
import { terser } from "rollup-plugin-terser"
import pkg from "./package.json"
import preprocess from "svelte-preprocess"
import typescript from "@rollup/plugin-typescript"

const devMode = false
const bannerString = "/**\n" + "* SVELDITOR " + pkg.version + "\n" + "* @licence MIT\n"+ "*/";

export default {
    input: "src/index.js",
    treeshake: { moduleSideEffects: false },

    output: [
        { banner: bannerString, file: pkg.module, format: "es", sourcemap: devMode },
        { banner: bannerString, file: pkg.main, format: "umd", name:"svelditor", sourcemap: devMode}
    ],
    plugins: [
        svelte({
            preprocess: preprocess({
                typescript: { transpileOnly: true }
            })
        }),
        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),
        commonjs(),
        typescript(),

        !devMode && terser({
            output: {
              comments: function (node, comment) {
                var text = comment.value;
                var type = comment.type;
                if (type == "comment2") { return /@licence/i.test(text); }
              }
            },
              mangle: false,
              compress: {
                  pure_funcs: ["console.log", "console.info"]
              }
            }
        )
    ]
}
