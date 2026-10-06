<script lang="ts">
  import { Typewriter } from '@svelte-registry/typewriter'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Single phrase'}
  <p class="text-lg"><Typewriter phrases="Components you own, not dependencies you rent." /></p>
{/if}

{#if story === 'Three-phrase loop'}
  <p class="text-lg font-medium">
    <Typewriter phrases={['Ship faster.', 'Own your code.', 'Compose freely.']} />
  </p>
{/if}

{#if story === 'No loop'}
  <p class="text-lg">
    <Typewriter
      phrases={['First, pull the source.', 'Then edit it freely.', 'Finally, ship it your way.']}
      loop={false}
    />
  </p>
{/if}

{#if story === 'Slow typing'}
  <p class="text-lg"><Typewriter phrases="Patience is a feature." typingSpeed={120} /></p>
{/if}

{#if story === 'Fast typing'}
  <p class="text-lg">
    <Typewriter phrases="Streaming updates at roughly 55 characters per second." typingSpeed={18} />
  </p>
{/if}

{#if story === 'Long pause'}
  <p class="text-lg"><Typewriter phrases={['Read this twice.', 'It is worth your while.']} pause={3500} /></p>
{/if}

{#if story === 'Delayed start'}
  <div class="flex items-center gap-3">
    <p class="text-lg"><Typewriter phrases="Loading your workspace…" startDelay={1200} /></p>
    <span class="text-xs text-muted-foreground">starts in 1.2s</span>
  </div>
{/if}

{#if story === 'Terminal style'}
  <div class="max-w-md rounded-lg bg-zinc-950 p-4 font-mono text-sm text-emerald-400 shadow-inner dark:bg-black/60">
    <span class="select-none">$ </span>
    <Typewriter phrases="npx shadcn-vue add https://uipkge.dev/r/vue/button.json" typingSpeed={28} />
  </div>
{/if}

{#if story === 'Hero heading'}
  <h2 class="text-4xl font-bold tracking-tight">
    Build interfaces that
    <span class="text-primary"><Typewriter phrases={['ship.', 'scale.', 'delight.']} /></span>
  </h2>
{/if}

{#if story === 'AI response'}
  <div class="max-w-xl rounded-lg border bg-muted/40 p-4">
    <p class="text-sm leading-relaxed text-muted-foreground">
      <Typewriter
        phrases="Sure — scaffold the page with a dashboard block, wire the KPI grid to your metrics endpoint, then swap the demo copy for real labels. Everything ships as source, so every edit stays yours."
        typingSpeed={14}
      />
    </p>
  </div>
{/if}

{#if story === 'No caret'}
  <p class="text-lg"><Typewriter phrases="Quietly, without a cursor." showCaret={false} /></p>
{/if}
