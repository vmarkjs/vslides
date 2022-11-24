export default {
  entries: [
    './src/index',
    {
      builder: 'mkdist',
      input: 'src/components/',
      outDir: 'components/',
    },
  ],
  declaration: true,
}
