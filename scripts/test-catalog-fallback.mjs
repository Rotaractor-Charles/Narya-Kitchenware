import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const modulePath = resolve(root, 'lib/api/catalog-fallback.ts')
const require = createRequire(import.meta.url)

assert.ok(existsSync(modulePath), 'lib/api/catalog-fallback.ts should exist')

function loadTs(filePath) {
  const source = readFileSync(filePath, 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filePath,
  })

  const module = { exports: {} }
  const localRequire = (id) => {
    if (id === '@/lib/sample-products') {
      return loadTs(resolve(root, 'lib/sample-products.ts'))
    }
    if (id === '@/lib/types') {
      return {}
    }
    if (id === 'server-only') {
      return {}
    }
    return require(id)
  }

  new Function('require', 'module', 'exports', outputText)(
    localRequire,
    module,
    module.exports,
  )
  return module.exports
}

const fallback = loadTs(modulePath)

const categories = fallback.getFallbackCategories()
assert.ok(categories.some((category) => category.slug === 'bakeware'))

const bakeware = fallback.getFallbackCategoryBySlug('bakeware')
assert.equal(bakeware?.name, 'Bakeware')

const products = fallback.getFallbackProducts({ category: 'bakeware', per_page: 100 })
assert.ok(products.data.length > 0)
assert.ok(products.data.every((product) => product.category.slug === 'bakeware'))
assert.equal(typeof products.data[0].id, 'number')
assert.equal(typeof products.data[0].price, 'number')
assert.ok(Array.isArray(products.data[0].images))
assert.equal(products.meta.total, products.data.length)

const product = fallback.getFallbackProductBySlug('ceramic-mixing-bowls')
assert.equal(product?.slug, 'ceramic-mixing-bowls')
assert.equal(product?.category.slug, 'bakeware')

const legacyProduct = fallback.getFallbackProductBySlug('cast-iron-grill-pan-28cm')
assert.equal(legacyProduct?.slug, 'cast-iron-grill-pan-28cm')
assert.equal(legacyProduct?.name, 'Cast Iron Grill Pan 28cm')

const giftProducts = fallback.getFallbackProducts({ collection: 'gift-sets', per_page: 100 })
assert.ok(giftProducts.data.length > 0)
assert.ok(giftProducts.data.every((item) => item.compare_at_price !== null || item.is_featured))
