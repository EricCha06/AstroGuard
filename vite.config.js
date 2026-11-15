import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// The browser only talks to /api (proxied to the local Express server). The NASA key never reaches the frontend.
export default defineConfig({ plugins: [react(), tailwindcss()], server: { proxy: { '/api': 'http://localhost:3001' } } })
