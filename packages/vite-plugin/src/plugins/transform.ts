import { Plugin } from 'vite'
import hash from 'hash-sum'
import VMarkRenderer from '@vmark/core'
import VSlidesParser from '@vslides/parser'
import CodeGen from '../utils/codegen'

export default function transform(transformRegex?: RegExp): Plugin {
  const regex = transformRegex ?? /\.md\?vslides$/
  const renderer = new VMarkRenderer({
    h(name, attr, children) {
      return {
        text: `h("${name}",${JSON.stringify(attr)},[${
          children ? children.map((c) => c.text || JSON.stringify(c)) : ''
        }])`,
      }
    },
    sanitize: false,
  })
  const parser = new VSlidesParser(renderer)
  const cg = new CodeGen()

  return {
    name: 'vslides:transform',
    async transform(src, id) {
      if (!regex.test(id)) {
        return
      }

      cg.import(['h', 'reactive'], 'vue')
      cg.import('App', '@vslides/core/components/App.vue')
      cg.import('@vslides/core/style/base.css')

      cg.blank()

      const nodes = await parser.parse(src)
      if (nodes[0].frontmatter?.theme) {
        const theme = nodes[0].frontmatter.theme
        cg.import('theme', theme)
      } else {
        cg.stmt('const theme = undefined;')
      }

      cg.blank()

      cg.stmt('export const pages = [];')
      nodes.forEach((page) => {
        cg.stmt(
          `pages.push({ component: () => ${
            page.node.text
          }, config: ${JSON.stringify(page.frontmatter)} });`,
        )
      })

      cg.blank()

      // handle hmr
      cg.stmt(
        'const _default = { setup() { return () => h(App, { pages, theme }) } };',
      )
      cg.stmt(`_default.__hmrId = "${hash(id)}";`)
      cg.stmt(`_default.__file = "${id}";`)
      cg.stmt('__VUE_HMR_RUNTIME__.createRecord(_default.__hmrId, _default);')
      cg.stmt(
        'import.meta.hot.accept(({ default: _default }) => { __VUE_HMR_RUNTIME__.reload(_default.__hmrId, _default) });',
      )

      cg.blank()

      cg.stmt('export default _default;')

      return cg.generate()
    },
  }
}
