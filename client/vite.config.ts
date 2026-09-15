import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    // Fixed port: the API's CORS policy and cookie origin are tied to it.
    server: {
        port: 5173,
        strictPort: true,
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            // y-monaco imports the pre-0.53 deep path, which monaco-editor's
            // `exports` map no longer resolves. Point it at the real file.
            'monaco-editor/esm/vs/editor/editor.api.js': fileURLToPath(
                new URL(
                    '../node_modules/monaco-editor/esm/vs/editor/editor.api.js',
                    import.meta.url,
                ),
            ),
        },
    },
})
