export default {
  entries: [
    './src/index',
    {
      builder: 'mkdist',
      input: 'src/components/',
      outDir: 'dist/components/',
    },
    {
      builder: 'mkdist',
      input: 'src/style/',
      outDir: 'dist/style/',
    },
  ],
  declaration: true,
}
