import { createServer } from 'vite'
import vslidesPlugin from '@vslides/vite-plugin'

async function serve() {
  const server = await createServer({
    plugins: [vslidesPlugin()],
  })
  server.listen()
}

serve().finally(() => {
  // exit
})
