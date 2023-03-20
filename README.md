# NHP

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
  modules: ['@privyid/nhp/module'],
})
```

Create new server config

```
npx nhp init
```

## Usage

### Simple Usage

```ts
import { defineServer } from '@privyid/nhp'

export default defineServer([
  {
    name     : 'example',
    baseUrl  : '/api/example',
    targetUrl: 'https://reqres.in/api/',
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
