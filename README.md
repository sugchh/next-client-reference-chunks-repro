# Turbopack lists a layout's client component with the not-found page's chunks

A minimal reproduction for Next.js (App Router, `next build` with Turbopack).

| File | Renders |
|---|---|
| `app/layout.js` | `<Shared />` |
| `app/not-found.js` | `<Shared />` and `<Heavy />` |
| `app/page.js` | `<Heavy />` and `<Own />` |

`Shared`, `Heavy` and `Own` are client components. On `/` the only `<Shared />` is the layout's.

## Run

```bash
npm install
npm run build
node check.mjs
```

`check.mjs` prints what the `/` route's `page_client-reference-manifest.js` lists for each client component and each server entry, and which scripts of the prerendered `/` contain `Heavy`.

## Turbopack (`npm run build`)

Observed on `next@16.4.0-canary.57` and on `next@16.3.6`:

```
clientModules of the "/" route:
  app/shared.js -> /_next/static/chunks/1pt9-3kso04ak.js, /_next/static/chunks/1iuobefgz-rxw.js
  app/heavy.js -> /_next/static/chunks/1pt9-3kso04ak.js, /_next/static/chunks/15e8gf7hyvr6m.js
  app/own.js -> /_next/static/chunks/1pt9-3kso04ak.js, /_next/static/chunks/15e8gf7hyvr6m.js
entryJSFiles of the "/" route:
  app/layout -> static/chunks/1pt9-3kso04ak.js
  app/not-found -> static/chunks/1pt9-3kso04ak.js, static/chunks/1iuobefgz-rxw.js
  app/page -> static/chunks/1pt9-3kso04ak.js, static/chunks/15e8gf7hyvr6m.js
scripts of "/" that hold the Heavy component:
  /_next/static/chunks/1iuobefgz-rxw.js
  /_next/static/chunks/15e8gf7hyvr6m.js
```

`app/shared.js` is in the layout's chunk, yet it is listed with the not-found page's chunk too. `/` therefore loads the not-found page's chunk beside the page's own, and both contain `Heavy`.

## webpack (`npm run build:webpack`)

Same source, same versions:

```
clientModules of the "/" route:
  app/heavy.js -> 974, static/chunks/app/page-dbee1cedc0c5f682.js
  app/shared.js -> 177, static/chunks/app/layout-39c190c8c03dcc96.js
  app/own.js -> 974, static/chunks/app/page-dbee1cedc0c5f682.js
entryJSFiles of the "/" route:
scripts of "/" that hold the Heavy component:
  /_next/static/chunks/app/page-dbee1cedc0c5f682.js
```

`app/shared.js` is listed with the layout's chunk alone, and `/` loads `Heavy` once.
