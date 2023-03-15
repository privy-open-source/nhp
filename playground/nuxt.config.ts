import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '../dist/module'

export default defineNuxtConfig({
  modules   : [MyModule],
  alias     : { '@privyid/nhp': fileURLToPath(new URL('../dist/', import.meta.url)) },
  typescript: {
    tsConfig: {
      compilerOptions: {
        strict          : false,
        strictNullChecks: true,
      },
    },
  },
})
