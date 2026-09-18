<script setup lang="ts">
import { ref, computed } from 'vue'
import { Highlight } from '@/components/ui/highlight'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

const longText = 'The quick brown fox jumps over the lazy dog. Foxes are clever, and the dog was not amused by the fox.'

const search = ref('fox')
const matchCount = ref(0)
// Real RegExp — a template string like "/\\bfox\\w*/gi" would be matched literally.
const foxRegex = /\bfox\w*/gi

// Real-world: filter a list of items and highlight the query
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

const listSearch = ref('')
const filteredItems = computed(() => {
  if (!listSearch.value) return items
  const q = listSearch.value.toLowerCase()
  return items.filter((i) => i.toLowerCase().includes(q))
})
</script>

<template>
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
    <Highlight text="Vue vue VUE vUe" query="vue" :case-sensitive="true" />
  </Story>

  <Story title="Whole-word matching" description="Only whole words are highlighted, not substrings.">
    <Highlight text="fox foxes foxy" query="fox" :whole-word="true" />
  </Story>

  <Story title="Regex query" description="Pass a RegExp to highlight a pattern.">
    <Highlight :text="longText" :query="foxRegex" />
  </Story>

  <Story title="Max highlights" description="Cap the number of rendered highlights.">
    <Highlight text="a b a b a b a b" query="a" :max-highlights="3" />
  </Story>

  <Story title="Custom highlight class" description="Override the default highlight styling.">
    <Highlight
      text="Search results matter"
      query="results"
      highlight-class="bg-primary/20 text-primary font-semibold rounded px-1"
    />
  </Story>

  <Story
    title="Live search with match count"
    description="Bind the query to an input; @matchCount gives the total for UX feedback."
  >
    <div class="space-y-3">
      <div class="flex items-center gap-2">
        <Input v-model="search" placeholder="Search..." class="max-w-xs" />
        <Badge v-if="matchCount > 0" variant="secondary"
          >{{ matchCount }} {{ matchCount === 1 ? 'match' : 'matches' }}</Badge
        >
      </div>
      <p class="text-sm leading-relaxed">
        <Highlight :text="longText" :query="search" @match-count="(n) => (matchCount = n)" />
      </p>
    </div>
  </Story>

  <Story
    title="List filtering"
    description="A common real-world pattern: filter a list and highlight the query in each result."
  >
    <div class="space-y-3">
      <Input v-model="listSearch" placeholder="Filter items..." class="max-w-xs" />
      <div class="space-y-1">
        <div
          v-for="item in filteredItems"
          :key="item"
          class="border-border bg-card rounded-md border px-3 py-2 text-sm"
        >
          <Highlight :text="item" :query="listSearch" />
        </div>
        <p v-if="filteredItems.length === 0" class="text-muted-foreground py-2 text-center text-sm">
          No results for "{{ listSearch }}"
        </p>
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
    <Highlight text="Line one has a fox.\nLine two has a dog.\nLine three has another fox." query="fox" />
  </Story>

  <Story title="Custom tag + class" description="Use span with a custom background for brand-matched highlighting.">
    <Highlight
      text="Find the needle in the haystack"
      query="needle"
      highlight-tag="span"
      highlight-class="bg-violet-200 text-violet-900 dark:bg-violet-500/30 dark:text-violet-100 rounded px-1 font-medium"
    />
  </Story>
</template>
