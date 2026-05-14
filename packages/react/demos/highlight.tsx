import { useMemo, useState } from 'react'
import Story from '../../components/story/Story'
import { Highlight } from '@react-registry/highlight'
import { Input } from '@react-registry/input'
import { Badge } from '@react-registry/badge'

const longText = 'The quick brown fox jumps over the lazy dog. Foxes are clever, and the dog was not amused by the fox.'

const items = [
  'Vue 3.5 Composition API',
  'React 19 Server Components',
  'Astro 5 Islands Architecture',
  'Tailwind CSS v4 Tokens',
  'Reka UI Headless Primitives',
  'TypeScript 5.7 Strict Mode',
  'Vite 6 Rolldown Bundler',
  'Nuxt 4 Nitro Engine',
]

export default function HighlightDemo() {
  const [search, setSearch] = useState('fox')
  const [matchCount, setMatchCount] = useState(0)

  const [listSearch, setListSearch] = useState('')
  const filteredItems = useMemo(() => {
    if (!listSearch) return items
    const q = listSearch.toLowerCase()
    return items.filter((i) => i.toLowerCase().includes(q))
  }, [listSearch])

  return (
    <>
      <Story title="Default" description="Highlights all occurrences of a query string.">
        <Highlight text="The quick brown fox jumps over the lazy dog" query="fox" />
      </Story>

      <Story title="Multiple matches" description="Every match is wrapped, not just the first.">
        <Highlight text="banana bandana cabana" query="na" />
      </Story>

      <Story title="Case-insensitive (default)" description="Matches regardless of letter case.">
        <Highlight text="Vue vue VUE vUe" query="vue" />
      </Story>

      <Story title="Case-sensitive" description="Only exact-case matches are highlighted.">
        <Highlight text="Vue vue VUE vUe" query="vue" caseSensitive />
      </Story>

      <Story title="Whole-word matching" description="Only whole words are highlighted, not substrings.">
        <Highlight text="fox foxes foxy" query="fox" wholeWord />
      </Story>

      <Story title="Regex query" description="Pass a RegExp to highlight a pattern.">
        <Highlight text={longText} query={/\bfox\w*/gi} />
      </Story>

      <Story title="Max highlights" description="Cap the number of rendered highlights.">
        <Highlight text="a b a b a b a b" query="a" maxHighlights={3} />
      </Story>

      <Story title="Custom highlight class" description="Override the default highlight styling.">
        <Highlight
          text="Search results matter"
          query="results"
          highlightClass="bg-primary/20 text-primary font-semibold rounded px-1"
        />
      </Story>

      <Story
        title="Live search with match count"
        description="Bind the query to an input; onTotalMatchCount gives the total for UX feedback."
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="max-w-xs"
            />
            {matchCount > 0 && (
              <Badge variant="secondary">
                {matchCount} {matchCount === 1 ? 'match' : 'matches'}
              </Badge>
            )}
          </div>
          <p className="text-sm leading-relaxed">
            <Highlight text={longText} query={search} onTotalMatchCount={setMatchCount} />
          </p>
        </div>
      </Story>

      <Story
        title="List filtering"
        description="A common real-world pattern: filter a list and highlight the query in each result."
      >
        <div className="space-y-3">
          <Input
            value={listSearch}
            onChange={(e) => setListSearch(e.target.value)}
            placeholder="Filter items..."
            className="max-w-xs"
          />
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <div key={item} className="border-border bg-card rounded-md border px-3 py-2 text-sm">
                <Highlight text={item} query={listSearch} />
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="text-muted-foreground py-2 text-center text-sm">
                No results for &ldquo;{listSearch}&rdquo;
              </p>
            )}
          </div>
        </div>
      </Story>

      <Story title="No query" description="When the query is empty, text renders unchanged.">
        <Highlight text="Nothing is highlighted here" query="" />
      </Story>

      <Story title="No matches" description="When nothing matches, text renders unchanged.">
        <Highlight text="Nothing to see here" query="xyz" />
      </Story>

      <Story title="Multi-line text" description="Highlights work across line breaks.">
        <Highlight text={'Line one has a fox.\nLine two has a dog.\nLine three has another fox.'} query="fox" />
      </Story>

      <Story title="Custom tag + class" description="Use span with a custom background for brand-matched highlighting.">
        <Highlight
          text="Find the needle in the haystack"
          query="needle"
          highlightTag="span"
          highlightClass="bg-violet-200 text-violet-900 dark:bg-violet-500/30 dark:text-violet-100 rounded px-1 font-medium"
        />
      </Story>
    </>
  )
}
