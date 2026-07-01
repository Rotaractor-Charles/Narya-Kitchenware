import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { RECIPES } from '@/lib/recipes'

export const metadata: Metadata = {
  title: 'Kenyan Recipes — Ugali, Pilau, Nyama Choma & More | Narya Kitchenware',
  description:
    'Ten credible Kenyan recipes — ugali, sukuma wiki, pilau, nyama choma, chapati, mandazi, and more. Written for home cooks using real ingredients and the right tools.',
}

const DIFF_COLOR: Record<string, string> = {
  Easy: 'bg-terra/10 text-terra',
  Medium: 'bg-amber-100 text-amber-700',
  Involved: 'bg-red-50 text-red-500',
}

export default function RecipesPage() {
  const categories = ['All', 'Main Dish', 'Side & Bread', 'Breakfast', 'Dessert & Snack']

  return (
    <div>
      {/* Hero */}
      <section className="bg-earth text-ivory px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.3em] uppercase text-sienna mb-4 font-medium">
            From our kitchen
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-tight">
            Recipes worth cooking.
          </h1>
          <p className="text-ivory/50 text-base sm:text-lg max-w-xl">
            Ten credible Kenyan recipes — from ugali to pilau — written for the home cook using real
            ingredients and the right tools.
          </p>
        </div>
      </section>

      {/* Recipes grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECIPES.map((recipe) => (
            <Link
              key={recipe.slug}
              href={`/recipes/${recipe.slug}`}
              className="group bg-white rounded-2xl border border-earth/10 overflow-hidden hover:border-earth/25 hover:shadow-md transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ivory-dark">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-earth/40 font-medium">
                    {recipe.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${DIFF_COLOR[recipe.difficulty]}`}
                  >
                    {recipe.difficulty}
                  </span>
                </div>

                <h2 className="font-serif text-lg text-earth leading-snug mb-1 group-hover:text-terra transition-colors">
                  {recipe.title}
                </h2>
                <p className="text-xs text-earth/50 line-clamp-2 mb-4">{recipe.tagline}</p>

                <div className="flex gap-4 text-[11px] text-earth/40">
                  <span>⏱ {recipe.totalTime}</span>
                  <span>👤 Serves {recipe.servings}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
