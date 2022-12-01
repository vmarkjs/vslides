import path from 'node:path'
import cac from 'cac'
import { createServer } from 'vite'
import vslidesPlugin from '@vslides/vite-plugin'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'

async function serve(filename: string) {
  const filepath = path.resolve(filename)
  const server = await createServer({
    optimizeDeps: {
      disabled: true,
    },
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    },
    plugins: [vslidesPlugin({ serveFile: filepath }), vue(), unocss()],
  })
  server.listen()
}

const cli = cac('vslides')

cli.command('<path>', `source file`).action(serve)
cli.help()
cli.parse()
