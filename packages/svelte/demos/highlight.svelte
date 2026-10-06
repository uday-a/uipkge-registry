<script lang="ts">
  import { Highlight } from '@svelte-registry/highlight'

  let { story }: { story: string } = $props()

  const longText =
    'The quick brown fox jumps over the lazy dog. Foxes are clever, and the dog was not amused by the fox.'

  let search = $state('fox')
  let matchCount = $state(0)
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

  let listSearch = $state('')
  const filteredItems = $derived.by(() => {
    if (!listSearch) return items
    const q = listSearch.toLowerCase()
    return items.filter((i) => i.toLowerCase().includes(q))
  })
</script>

{#if story === 'Default'}
  <Highlight text="The quick brown fox jumps over the lazy dog" query="fox" />
{/if}

{#if story === 'Multiple matches'}
  <Highlight text="banana bandana cabana" query="na" />
{/if}

{#if story === 'Case-insensitive (default)'}
  <Highlight text="Vue vue VUE vUe" query="vue" />
{/if}

{#if story === 'Case-sensitive'}
  <Highlight text="Vue vue VUE vUe" query="vue" caseSensitive={true} />
{/if}

{#if story === 'Whole-word matching'}
  <Highlight text="fox foxes foxy" query="fox" wholeWord={true} />
{/if}

{#if story === 'Regex query'}
  <Highlight text={longText} query={foxRegex} />
{/if}

{#if story === 'Max highlights'}
  <Highlight text="a b a b a b a b" query="a" maxHighlights={3} />
{/if}

{#if story === 'Custom highlight class'}
  <Highlight
    text="Search results matter"
    query="results"
    highlightClass="bg-primary/20 text-primary font-semibold rounded px-1"
  />
{/if}

{#if story === 'Live search with match count'}
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <input
        bind:value={search}
        placeholder="Search..."
        class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full max-w-xs rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      />
      {#if matchCount > 0}
        <span class="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-semibold">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
        </span>
      {/if}
    </div>
    <p class="text-sm leading-relaxed">
      <Highlight text={longText} query={search} onMatchCount={(n) => (matchCount = n)} />
    </p>
  </div>
{/if}

{#if story === 'List filtering'}
  <div class="space-y-3">
    <input
      bind:value={listSearch}
      placeholder="Filter items..."
      class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full max-w-xs rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
    />
    <div class="space-y-1">
      {#each filteredItems as item (item)}
        <div class="border-border bg-card rounded-md border px-3 py-2 text-sm">
          <Highlight text={item} query={listSearch} />
        </div>
      {/each}
      {#if filteredItems.length === 0}
        <p class="text-muted-foreground py-2 text-center text-sm">
          No results for "{listSearch}"
        </p>
      {/if}
    </div>
  </div>
{/if}

{#if story === 'No query'}
  <Highlight text="Nothing is highlighted here" query="" />
{/if}

{#if story === 'No matches'}
  <Highlight text="Nothing to see here" query="xyz" />
{/if}

{#if story === 'Multi-line text'}
  <Highlight text="Line one has a fox.\nLine two has a dog.\nLine three has another fox." query="fox" />
{/if}

{#if story === 'Custom tag + class'}
  <Highlight
    text="Find the needle in the haystack"
    query="needle"
    highlightTag="span"
    highlightClass="bg-violet-200 text-violet-900 dark:bg-violet-500/30 dark:text-violet-100 rounded px-1 font-medium"
  />
{/if}
