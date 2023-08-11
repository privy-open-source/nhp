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
import { getCookie, setHeader } from 'h3'
import { defineServer, defineEventInterceptor } from '@privyid/nhp/core'

export default defineServer([
  {
    name      : 'bin',
    baseUrl   : '/api/bin',
    targetUrl : 'https://httpbin.org',
    onProxyReq: defineEventInterceptor((proxyEvent, event) => {
      const token = getCookie(event, 'oauth/token')

      if (token)
        setHeader(proxyEvent, 'Authorization', `Bearer ${token}`)
    }),
  },
])
```

### Dynamic Proxy

Dynamic Proxy is special type proxy, which can dynamically target server based on query params `url`. It usefull for proxy download server which ussually changes alltime.

Example:

```ts
export default defineServer([
  {
    name          : 'force-download',
    baseUrl       : '/force/download',
    proxyType     : 'dynamic',
    allowFrom     : ['my.cdn.com', 's3.amazon.com'], // or using string with delimeter ;
    downloadHeader: true,
    downloadExt   : '.pdf',
  },
])
```

Then, you can access `/force/download?url=http://my.cdn.com/xxxxx/`

### Schema Code-Generator (Swagger)

NHP include code generator to transform OpenAPI v2 to Typescript. Just add `schemaURL` in your server then run `npx nhp schema`,

```ts
export default defineServer([
  {
    name     : 'server-b',
    baseUrl  : '/api/server-b',
    // ...
    // Using local json
    schemaUrl: './path/doc.json',
  },
  {
    name     : 'server-a',
    baseUrl  : '/api/server-a',
    // ...
    // Using remote schema
    schemaUrl: 'http://server-a.dev/swagger/doc.json',
  },
])
```

See [example](./playground/) and result [here](./playground/api/document.ts)

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
