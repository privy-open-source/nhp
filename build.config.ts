import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: './src/index' },
    {
      builder: 'mkdist',
      input  : 'src/bin',
      outDir : 'dist/bin',
    },
  ],
  externals: [
    'h3',
    '#imports',
    '~/server.config',
  ],
  declaration: true,
  rollup     : {
    emitCJS  : true,
    cjsBridge: false,
    esbuild  : { tsconfig: 'tsconfig.build.json' },
  },
})
