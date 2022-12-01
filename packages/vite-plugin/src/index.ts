import { Plugin } from 'vite'
import server from './plugins/server'
import transform from './plugins/transform'

interface VSlidesPluginOption {
  serveFile?: string | null | false
}

export default function vslidesPlugin(options?: VSlidesPluginOption): Plugin[] {
  const plugins = [transform()]
  if (options?.serveFile) {
    plugins.push(server(options.serveFile))
  }
  return plugins
}
