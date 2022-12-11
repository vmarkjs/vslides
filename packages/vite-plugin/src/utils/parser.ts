import VMarkRenderer from '@vmark/core'

export default class MarkdownParser {
  constructor(
    private renderer: VMarkRenderer<{ text: string }>,
    private src: string,
  ) {}

  async parse() {
    const nodes: string[] = []
    await Promise.all(
      this.src.split('---').map(async (s) => {
        const { text } = await this.renderer.render(s)
        nodes.push(text)
      }),
    )
    return nodes
  }
}
