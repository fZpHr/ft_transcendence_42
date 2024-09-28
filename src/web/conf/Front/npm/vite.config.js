import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8080,
    },
    resolve: {
        alias: [
            { find: '@js', replacement: path.resolve(__dirname, 'src/js/') },
            { find: '@css', replacement: path.resolve(__dirname, 'src/css/') },
            { find: '@components', replacement: path.resolve(__dirname, 'src/js/components/') },
        ],
      },    
})

