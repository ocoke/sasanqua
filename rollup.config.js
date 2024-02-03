import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
export default {
	input: 'client/main.js',
	output: {
		file: 'public/script.js',
		format: 'es',
        compact: true,
		plugins: [terser()],
	},
    plugins: [nodeResolve(), json()],
};