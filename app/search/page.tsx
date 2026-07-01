import type { Metadata } from 'next'
import SearchResults from './SearchResults'

type Props = { searchParams: Promise<{ q?: string; page?: string }> }

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search results for "${q}" — Narya Kitchenware` : 'Search — Narya Kitchenware',
    robots: { index: false, follow: true },
  }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page = '1' } = await searchParams
  return <SearchResults query={q} page={parseInt(page, 10)} />
}
