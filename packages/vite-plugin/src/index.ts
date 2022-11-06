import { send, Plugin } from 'vite'
import hash from 'hash-sum'
import VMarkRenderer from '@vmark/core'

const vslidesIdRegex = /\.md\?vslides$/

interface VSlidesPluginOption {
  filepath?: string
}

export default function vitePlugin(option: VSlidesPluginOption): Plugin {
  const renderer = new VMarkRenderer({
    h(name, attr, children) {
      return {
        text: `h("${name}", ${JSON.stringify(attr)}, [${children?.map(
          (c) => c.text || JSON.stringify(c),
        )}])`,
      }
    },
  })
  return {
    name: 'vslides',
    async transform(src, id) {
      if (!vslidesIdRegex.test(id)) {
        return
      }
      let code = `\n\nimport { h, reactive } from "vue";`
      code += `\nimport Presenter from "@vslides/core";`
      code += `\nexport const nodes = reactive([]);`
      await Promise.all(
        src.split('---').map(async (s) => {
          const { text } = await renderer.render(s)
          code += `\nnodes.push(${text});`
        }),
      )

      // handle hmr
      code += `\nconst _default = { setup() { return () => h(Presenter, () => nodes) } };`
      code += `\n_default.__hmrId = '${hash(id)}';`
      code += `\n_default.__file = '${id}';`
      code += `\n__VUE_HMR_RUNTIME__.createRecord(_default.__hmrId, _default);`
      code += `\nimport.meta.hot.accept(({ default: _default }) => { __VUE_HMR_RUNTIME__.rerender(_default.__hmrId, _default.render) });`
      code += `\nexport default _default;\n\n`
      return code
    },
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
    import App from '/@fs${option.filepath}?vslides'
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
