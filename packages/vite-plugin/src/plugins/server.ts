import { send, Plugin } from 'vite'

export default function server(filepath: string): Plugin {
  return {
    name: 'vslides:server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url !== '/') return next()
        const html = await server.transformIndexHtml(
          '/',
          `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { createApp } from 'vue'
    import App from '/@fs${filepath}?vslides'
    const app = createApp(App)
    app.mount('#app')
  </script>
</body>
</html>`,
          req.originalUrl,
        )
        return send(req, res, html, 'html', {})
      })
    },
  }
}
