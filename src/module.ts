import {
  addServerHandler,
  createResolver,
  defineNuxtModule,
  addImports,
} from '@nuxt/kit'

export interface ModuleOptions {
  autoImport?: boolean,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name         : '@privyid/nhp',
    configKey    : 'nhp',
    compatibility: { nuxt: '^3.0.0' },
  },
  defaults: { autoImport: true },
  setup (options) {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      middleware: true,
      lazy      : true,
      handler   : resolve('./runtime/server/middleware/proxy'),
    })

    if (options.autoImport !== false) {
      addImports(['defineServer', 'defineEventInterceptor'].map((name) => {
        return {
          name,
          from: '@privyid/nhp/core',
        }
      }))
    }
  },
})
