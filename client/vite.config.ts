import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        // 5173 is usually taken by another project, so this one is pinned.
        port: 5175,
        strictPort: true,
        // Listen on the network too, so a phone on the same Wi-Fi can open it.
        host: true,
        // The API and websockets are proxied so the app, the API and the auth
        // cookie share one origin, the same way production is served. That is
        // what lets a phone use the LAN address without any CORS setup.
        proxy: {
            '/api': 'http://localhost:4000',
            '/socket.io': { target: 'http://localhost:4000', ws: true },
        },
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
