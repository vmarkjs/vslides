export default {
  entries: [
    './src/index',
    {
      builder: 'mkdist',
      input: 'src/components/',
      outDir: 'components/',
    },
    {
      builder: 'mkdist',
      input: 'src/style/',
      outDir: 'style/',
    },
  ],
  declaration: true,
}
