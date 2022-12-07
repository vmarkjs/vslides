import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import cac from 'cac'
import { createServer } from 'vite'
import vslidesPlugin from '@vslides/vite-plugin'
import vue from '@vitejs/plugin-vue'
import unocss from 'unocss/vite'

async function serve(filename: string) {
  const sourcePath = fileURLToPath(import.meta.url)
  const filePath = path.resolve(filename)
  const fileDir = path.resolve(path.dirname(filename))

  const modulePath = fs.existsSync(
    path.resolve(sourcePath, '../../node_modules/'),
  )
    ? path.resolve(sourcePath, '../../node_modules/')
    : path.resolve(sourcePath, '../../../')

  const rootPath = path.resolve(
    process.env.NODE_PATH ? process.env.NODE_PATH.split(':')[0] : modulePath,
  )

  const server = await createServer({
    root: rootPath,
    optimizeDeps: {
      include: ['vue'],
    },
    resolve: {
      alias: {
        '@vslides/core': '@vslides/core',
      },
    },
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    },
    plugins: [vslidesPlugin({ serveFile: filePath }), vue(), unocss()],
  })
  server.watcher.add(fileDir)
  server.listen()
}

const cli = cac('vslides')

cli.command('<path>', `source file`).action(serve)
cli.help()
cli.parse()
