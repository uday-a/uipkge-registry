<script lang="ts">
  import { ScrollSpy } from '@svelte-registry/scroll-spy'

  let { story }: { story: string } = $props()

  let containerEl: HTMLElement | null = $state(null)

  const sections = [
    { id: 'overview', title: 'Overview', body: 'The scroll-spy highlights the section currently in view.' },
    { id: 'install', title: 'Installation', body: 'Install the primitive, then anchor each section with an id.' },
    { id: 'usage', title: 'Usage', body: 'Clicking a link smooth-scrolls to the section and updates the URL hash.' },
    { id: 'api', title: 'API reference', body: 'Props cover position, variant, indicator mode, and line width.' },
  ]

  // Prefix section ids per story so same-page cards never share anchors.
  const prefix = $derived(story === 'Left rail' ? 'spy-l' : story === 'Top stepper' ? 'spy-t' : 'spy-r')
  const items = $derived(sections.map((s) => ({ href: `#${prefix}-${s.id}`, title: s.title })))
</script>

{#if story === 'Right rail'}
  <div class="grid grid-cols-[1fr_180px] gap-6">
    <div bind:this={containerEl} class="h-64 space-y-6 overflow-y-auto rounded-lg border p-4">
      {#each sections as s (s.id)}
        <section id="{prefix}-{s.id}" class="scroll-mt-2">
          <h4 class="text-sm font-semibold">{s.title}</h4>
          <p class="text-muted-foreground text-sm">{s.body}</p>
          <p class="text-muted-foreground/60 pt-16 text-xs">Scroll for more…</p>
        </section>
      {/each}
    </div>
    <ScrollSpy {items} title="On this page" scrollContainer={containerEl} />
  </div>
{/if}

{#if story === 'Left rail'}
  <div class="grid grid-cols-[180px_1fr] gap-6">
    <ScrollSpy {items} title="Contents" position="left" scrollContainer={containerEl} />
    <div bind:this={containerEl} class="h-64 space-y-6 overflow-y-auto rounded-lg border p-4">
      {#each sections as s (s.id)}
        <section id="{prefix}-{s.id}" class="scroll-mt-2">
          <h4 class="text-sm font-semibold">{s.title}</h4>
          <p class="text-muted-foreground text-sm">{s.body}</p>
          <p class="text-muted-foreground/60 pt-16 text-xs">Scroll for more…</p>
        </section>
      {/each}
    </div>
  </div>
{/if}

{#if story === 'Top stepper'}
  <div class="flex flex-col gap-4">
    <ScrollSpy {items} position="top" scrollContainer={containerEl} />
    <div bind:this={containerEl} class="h-56 space-y-6 overflow-y-auto rounded-lg border p-4">
      {#each sections as s (s.id)}
        <section id="{prefix}-{s.id}" class="scroll-mt-2">
          <h4 class="text-sm font-semibold">{s.title}</h4>
          <p class="text-muted-foreground text-sm">{s.body}</p>
          <p class="text-muted-foreground/60 pt-16 text-xs">Scroll for more…</p>
        </section>
      {/each}
    </div>
  </div>
{/if}
