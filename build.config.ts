import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries  : ['./src/index'],
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
