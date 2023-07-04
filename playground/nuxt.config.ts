import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '../src/module'

export default defineNuxtConfig({
  modules   : [MyModule],
  typescript: {
    tsConfig: {
      compilerOptions: {
        strict          : true,
        strictNullChecks: true,
      },
    },
  },
})
