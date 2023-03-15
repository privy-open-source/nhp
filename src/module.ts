import {
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name         : '@privyid/nhp',
    configKey    : 'nhp',
    compatibility: { nuxt: '^3.0.0' },
  },
  setup () {
    const { resolve } = createResolver(import.meta.url)

    addServerHandler({
      middleware: true,
      handler   : resolve('./runtime/proxy'),
    })
  },
})
