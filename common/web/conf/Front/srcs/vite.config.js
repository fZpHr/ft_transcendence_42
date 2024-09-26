import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
    server: {
        port: 3030,
    },
    resolve: {
        alias: [
            { find: '@js', replacement: path.resolve(__dirname, 'src/js/') },
            { find: '@css', replacement: path.resolve(__dirname, 'src/css/') },
        ],
      },    
})

