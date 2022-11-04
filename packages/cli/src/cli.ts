import { createServer } from 'vite'

export function serve() {
  createServer({
    root: '.',
  })
}
