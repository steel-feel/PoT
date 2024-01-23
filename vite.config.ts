import { defineConfig } from 'vite'

export default defineConfig({
	optimizeDeps: {
		esbuildOptions: {
			target: 'esnext'
		}
	},
	worker: {
		format: 'es'
	},
	plugins: [],
	server: {
		host: '0.0.0.0',
		port: 8000,
		headers: {
			"Cross-Origin-Opener-Policy": "same-origin",
			"Cross-Origin-Embedder-Policy": "require-corp"
		}
	},
	clearScreen: false,
})