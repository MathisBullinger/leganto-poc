import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

export default {
  server: {
    port: 1234,
  },
  plugins: [preact()],
}
