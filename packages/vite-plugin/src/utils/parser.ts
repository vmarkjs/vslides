import VMarkRenderer from '@vmark/core'
import { parse } from 'yaml'

export default class MarkdownParser {
  constructor(private renderer: VMarkRenderer<{ text: string }>) {}

  async parse(src: string) {
    // TODO: more specific config type
    const nodes: { text: string; frontmatter?: Record<string, string> }[] = []

    // eat all leading spaces
    src = src.trimStart()

    // add additional page
    if (src.startsWith('---\n\n')) {
      src = '\n\n' + src
    }

    while (true) {
      // find page boundary
      //                      +0 1234 5 6
      const pos = src.search(/\n\n---\n/m)

      const page = pos === -1 ? src : src.slice(0, pos)
      const node = await this.parsePage(page)
      nodes.push(node)

      if (pos === -1) break

      if (src[pos + 6] === '\n') {
        // skips ---
        src = src.slice(pos + 7)
      } else {
        // preserves frontmatter
        src = src.slice(pos + 2)
      }
    }

    return nodes
  }

  async parsePage(page: string) {
    let frontmatter
    if (page.startsWith('---\n')) {
      const last = page.search('\n---')
      const fm = page.slice(4, last)
      page = page.slice(last + 6)
      frontmatter = parse(fm)
    }
    const r = await this.renderer.render(page)
    return {
      text: r.text,
      frontmatter,
    }
  }
}
