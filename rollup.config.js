import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser';
export default {
	input: 'client/main.js',
	output: {
		file: 'public/script.js',
		format: 'es',
        compact: true,
		plugins: [terser()],
	},
    plugins: [nodeResolve()],
};