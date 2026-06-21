import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RECIPES, getRecipeBySlug } from '@/lib/recipes'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return RECIPES.map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) return {}
  return { title: recipe.title, description: recipe.tagline }
}

const DIFF_COLOR: Record<string, string> = {
  Easy:     'bg-terra/10 text-terra',
  Medium:   'bg-amber-100 text-amber-700',
  Involved: 'bg-red-50 text-red-500',
}

export default async function RecipePage({ params }: Props) {
  const { slug } = await params
  const recipe = getRecipeBySlug(slug)
  if (!recipe) notFound()

  const others = RECIPES.filter(r => r.slug !== recipe.slug).slice(0, 3)

  return (
    <div>
      {/* Hero colour plate */}
      <div className={`${recipe.color} h-52 sm:h-64 flex items-end`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 w-full">
          <p className="text-[10px] uppercase tracking-widest text-earth/40 font-medium mb-1">
            <Link href="/recipes" className="hover:text-earth transition-colors">Recipes</Link>
            {' / '}{recipe.category}
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-earth">{recipe.title}</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Meta strip */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${DIFF_COLOR[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
          {[
            { label: 'Prep',    val: recipe.prepTime  },
            { label: 'Cook',    val: recipe.cookTime  },
            { label: 'Total',   val: recipe.totalTime },
            { label: 'Serves',  val: `${recipe.servings} people` },
            { label: 'Origin',  val: recipe.origin    },
          ].map(m => (
            <div key={m.label} className="bg-ivory-dark rounded-xl px-3 py-1.5 text-[11px]">
              <span className="text-earth/40 mr-1">{m.label}:</span>
              <span className="text-earth font-medium">{m.val}</span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-earth/65 text-base leading-relaxed mb-10 border-l-2 border-terra pl-4 italic">
          {recipe.tagline}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left: Ingredients + Tools */}
          <div className="lg:col-span-1 space-y-7">

            {/* Ingredients */}
            <div className="bg-white rounded-2xl border border-earth/10 p-5 lg:sticky lg:top-24">
              <h2 className="font-serif text-lg text-earth mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className={`text-sm ${ing.startsWith('—') ? 'text-earth/40 text-[11px] uppercase tracking-widest pt-2 font-medium' : 'text-earth/70 flex items-start gap-2'}`}>
                    {!ing.startsWith('—') && (
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-terra shrink-0" />
                    )}
                    {ing}
                  </li>
                ))}
              </ul>

              {/* Recommended tools */}
              <div className="mt-5 pt-4 border-t border-earth/8">
                <p className="text-[10px] uppercase tracking-widest text-earth/40 font-medium mb-2.5">
                  Tools used
                </p>
                <ul className="space-y-1.5">
                  {recipe.tools.map(tool => (
                    <li key={tool} className="flex items-center gap-2 text-xs text-terra">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right: Instructions + Tips */}
          <div className="lg:col-span-2 space-y-8">

            {/* Instructions */}
            <div>
              <h2 className="font-serif text-xl text-earth mb-5">Method</h2>
              <ol className="space-y-5">
                {recipe.instructions.map((inst, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="shrink-0 w-7 h-7 rounded-full bg-earth text-ivory text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-earth text-sm mb-0.5">{inst.step}</p>
                      <p className="text-sm text-earth/60 leading-relaxed">{inst.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="bg-sienna/8 rounded-2xl p-5 border border-sienna/20">
              <h3 className="font-semibold text-earth text-sm mb-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Cook's Notes
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-earth/65 flex items-start gap-2">
                    <span className="text-terra mt-0.5 shrink-0">→</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* More recipes */}
        <div className="mt-14 pt-10 border-t border-earth/8">
          <h2 className="font-serif text-xl text-earth mb-6">More Recipes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {others.map(r => (
              <Link key={r.slug} href={`/recipes/${r.slug}`}
                className="group bg-white rounded-2xl border border-earth/10 overflow-hidden hover:border-earth/25 transition-all">
                <div className={`${r.color} h-28 flex items-center justify-center`}>
                  <span className="font-serif text-4xl opacity-15 select-none">{r.title.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <p className="font-serif text-earth text-sm group-hover:text-terra transition-colors">{r.title}</p>
                  <p className="text-[11px] text-earth/40 mt-0.5">{r.totalTime} · Serves {r.servings}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
