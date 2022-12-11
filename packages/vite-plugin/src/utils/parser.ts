import VMarkRenderer from '@vmark/core'

export default class MarkdownParser {
  constructor(private renderer: VMarkRenderer<{ text: string }>) {}

  async parse(src: string) {
    const nodes: string[] = []

    while (true) {
      // eat all leading spaces
      src = src.trimStart()

      // find page boundary
      const pos = src.search(/\n\n---\n/m)

      if (pos === -1) {
        nodes.push((await this.renderer.render(src)).text)
        break
      } else {
        nodes.push((await this.renderer.render(src.slice(0, pos))).text)
        if (src[pos + 6] === '\n') {
          src = src.slice(pos + 7)
        } else {
          src = src.slice(pos + 2)
        }
      }
    }

    return nodes
  }
}
