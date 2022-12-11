export default class CodeGen {
  private lines: string[] = []

  import(name: string | string[], path?: string) {
    if (path) {
      this.lines.push(
        `import ${
          Array.isArray(name) ? '{ ' + name.join(', ') + ' }' : name
        } from "${path}";`,
      )
    } else {
      this.lines.push(`import "${name}";`)
    }
  }

  stmt(line: string) {
    this.lines.push(line)
  }

  blank() {
    this.lines.push('')
  }

  generate() {
    const code = '\n\n' + this.lines.join('\n') + '\n\n'
    this.lines = []
    return code
  }
}
