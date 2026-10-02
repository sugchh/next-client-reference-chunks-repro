// node check.mjs : after `next build`, prints what the "/" route's client
// reference manifest lists for each client component and each server entry,
// and every script of the prerendered "/" that holds the Heavy component.
import fs from "node:fs"
import vm from "node:vm"

const context = { globalThis: {} }
vm.runInNewContext(
  fs.readFileSync(".next/server/app/page_client-reference-manifest.js", "utf8"),
  context
)
const manifest = context.globalThis.__RSC_MANIFEST["/page"]
const name = (key) => key.replace(/^.*\/app\//, "app/")

console.log('clientModules of the "/" route:')
for (const [key, entry] of Object.entries(manifest.clientModules)) {
  if (!key.includes("node_modules")) console.log(`  ${name(key)} -> ${entry.chunks.join(", ")}`)
}

console.log('entryJSFiles of the "/" route:')
for (const [key, files] of Object.entries(manifest.entryJSFiles ?? {})) {
  if (!key.includes("node_modules")) console.log(`  ${name(key)} -> ${files.join(", ")}`)
}

const html = fs.readFileSync(".next/server/app/index.html", "utf8")
const scripts = [...html.matchAll(/<script[^>]*src="([^"]+)"[^>]*>/g)]
  .filter((match) => !/nomodule/i.test(match[0]))
  .map((match) => match[1])
console.log('scripts of "/" that hold the Heavy component:')
for (const src of new Set(scripts)) {
  const file = `.next/${decodeURIComponent(src).replace(/^\/_next\//, "").replace(/\?.*$/, "")}`
  if (fs.readFileSync(file, "utf8").includes("HEAVY_MODULE")) console.log(`  ${src}`)
}
