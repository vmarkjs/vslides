import { Plugin } from 'vite'
import server from './plugins/server'
import transform from './plugins/transform'

interface VSlidesPluginOption {
  filepath?: string
}

export default function vslidesPlugin(options?: VSlidesPluginOption): Plugin[] {
  return [transform(), server(options?.filepath ?? '')]
}
