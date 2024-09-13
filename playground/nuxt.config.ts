import { defineNuxtConfig } from 'nuxt/config'
import MyModule from '../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  app    : { baseURL: '/rc' },

  typescript: {
    tsConfig: {
      compilerOptions: {
        strict          : true,
        strictNullChecks: true,
      },
    },
  },

  compatibilityDate: '2024-09-13',
})
