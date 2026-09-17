<script setup lang="ts">
import { Anchor, AnchorLink } from '@/components/ui/anchor'
import type { AnchorItem } from '@/components/ui/anchor'

const items: AnchorItem[] = [
  { href: '#section-1', title: 'Introduction' },
  {
    href: '#section-2',
    title: 'Architecture',
    children: [
      { href: '#section-2-1', title: 'Modules' },
      { href: '#section-2-2', title: 'Boundaries' },
    ],
  },
  { href: '#section-3', title: 'API' },
  { href: '#section-4', title: 'Examples' },
]
</script>

<template>
  <Story
    title="Declarative items"
    description="Pass a flat or nested array. Active link highlights as you scroll the page."
  >
    <div class="grid grid-cols-[160px_1fr] gap-6">
      <Anchor :items="items" :offset-top="80" affix />
      <div class="space-y-12">
        <section id="section-1" class="min-h-[60vh]">
          <h2 class="text-lg font-semibold">Introduction</h2>
          <p class="text-muted-foreground text-sm">Lorem ipsum dolor sit amet.</p>
        </section>
        <section id="section-2" class="min-h-[40vh]">
          <h2 class="text-lg font-semibold">Architecture</h2>
          <div id="section-2-1" class="min-h-[30vh]">
            <h3 class="font-medium">Modules</h3>
            <p class="text-muted-foreground text-sm">Sub-section content.</p>
          </div>
          <div id="section-2-2" class="min-h-[30vh]">
            <h3 class="font-medium">Boundaries</h3>
            <p class="text-muted-foreground text-sm">Sub-section content.</p>
          </div>
        </section>
        <section id="section-3" class="min-h-[60vh]">
          <h2 class="text-lg font-semibold">API</h2>
        </section>
        <section id="section-4" class="min-h-[60vh]">
          <h2 class="text-lg font-semibold">Examples</h2>
        </section>
      </div>
    </div>
  </Story>

  <Story title="Composed with AnchorLink" description="Use child components for full control over each link.">
    <div class="grid grid-cols-[160px_1fr] gap-6">
      <Anchor :offset-top="80" affix>
        <AnchorLink href="#a-1" title="Apples" />
        <AnchorLink href="#a-2" title="Bananas">
          <AnchorLink href="#a-2-1" title="Cavendish" />
          <AnchorLink href="#a-2-2" title="Plantain" />
        </AnchorLink>
        <AnchorLink href="#a-3" title="Cherries" />
      </Anchor>
      <div class="space-y-12">
        <section id="a-1" class="min-h-[40vh]"><h2 class="font-semibold">Apples</h2></section>
        <section id="a-2" class="min-h-[20vh]"><h2 class="font-semibold">Bananas</h2></section>
        <section id="a-2-1" class="min-h-[30vh]"><h3>Cavendish</h3></section>
        <section id="a-2-2" class="min-h-[30vh]"><h3>Plantain</h3></section>
        <section id="a-3" class="min-h-[40vh]"><h2 class="font-semibold">Cherries</h2></section>
      </div>
    </div>
  </Story>
</template>
