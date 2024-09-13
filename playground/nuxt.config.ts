import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['../src/module'],
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
