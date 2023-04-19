import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: './src/core/index',
      name : 'core',
    },
    {
      builder: 'mkdist',
      input  : 'src/bin',
      outDir : 'dist/bin',
    },
  ],
  externals  : ['#imports', '~/server.config'],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: false,
  },
})
