# NHP

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

> Nuxt HTTP Proxy Module

## Compabilities

- Nuxt 3

## Instalation

```
yarn add --dev @privyid/nhp
```

Then, add into `nuxt.config.ts` modules

```ts
export default defineNuxtConfig({
  modules: ['@privyid/nhp'],
})
```

Create new server config

```
npx nhp init
```

## Usage

### Simple Usage

```ts
import { defineServer } from '@privyid/nhp/core'

export default defineServer([
  {
    name     : 'example',
    baseUrl  : '/api/example',
    targetUrl: 'https://reqres.in/api/',
  },
])
```

### Intercept Requests and Response

NHP provide util `defineEventInterceptor` for `onProxyReq` and `onProxyRes`, it will translate the handler to [H3][H3] compability event.
So, you can use all utilities from [H3][H3]

```ts
import { getCookies, setHeader } from 'h3'
import { defineServer, defineEventInterceptor } from '@privyid/nhp/core'

export default defineServer([
  {
    name      : 'bin',
    baseUrl   : '/api/bin',
    targetUrl : 'https://httpbin.org',
    onProxyReq: defineEventInterceptor((proxyEvent, event) => {
      const token = getCookie(event, 'session/token')

      if (token)
        setHeader(proxyEvent, 'Authentication', `Bearer ${token}`)
    }),
  },
])
```

## Contribution

- Clone this repository
- Play [Nyan Cat](https://www.youtube.com/watch?v=QH2-TGUlwu4) in the background (really important!)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable` (use `npm i -g corepack` for Node.js < 16.10)
- Run `yarn install`
- Run `yarn dev:prepare` to generate type stubs.
- Use `yarn dev` to start [playground](./playground) in development mode.

## License

[MIT License](/LICENSE)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@privyid/nhp/latest.svg?style=for-the-badge&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@privyid/nhp

[npm-downloads-src]: https://img.shields.io/npm/dm/@privyid/nhp.svg?style=for-the-badge&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@privyid/nhp

[license-src]: https://img.shields.io/npm/l/@privyid/nhp.svg?style=for-the-badge&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@privyid/nhp

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?style=for-the-badge&logo=nuxt.js
[nuxt-href]: https://nuxt.com

[H3]: https://github.com/unjs/h3
