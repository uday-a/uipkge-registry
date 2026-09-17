<script setup lang="ts">
import { Typewriter } from '@/components/ui/typewriter'
</script>

<template>
  <Story
    title="Single phrase"
    description="Pass a string to type one phrase. The caret keeps blinking once typing completes."
  >
    <p class="text-lg"><Typewriter phrases="Components you own, not dependencies you rent." /></p>
  </Story>

  <Story
    title="Three-phrase loop"
    description="Pass an array to cycle phrases — type, hold, delete, next. Loops forever by default."
  >
    <p class="text-lg font-medium">
      <Typewriter :phrases="['Ship faster.', 'Own your code.', 'Compose freely.']" />
    </p>
  </Story>

  <Story
    title="No loop"
    description="With loop=false the sequence stops after fully typing the last phrase; the caret keeps blinking."
  >
    <p class="text-lg">
      <Typewriter
        :phrases="['First, pull the source.', 'Then edit it freely.', 'Finally, ship it your way.']"
        :loop="false"
      />
    </p>
  </Story>

  <Story
    title="Slow typing"
    description="typing-speed is milliseconds per character — 120ms gives a deliberate, dramatic pace."
  >
    <p class="text-lg"><Typewriter phrases="Patience is a feature." :typing-speed="120" /></p>
  </Story>

  <Story title="Fast typing" description="18ms per character reads like a live feed or terminal stream.">
    <p class="text-lg">
      <Typewriter phrases="Streaming updates at roughly 55 characters per second." :typing-speed="18" />
    </p>
  </Story>

  <Story
    title="Long pause"
    description="pause holds each completed phrase before deleting — 3500ms gives readers time to actually read it."
  >
    <p class="text-lg"><Typewriter :phrases="['Read this twice.', 'It is worth your while.']" :pause="3500" /></p>
  </Story>

  <Story
    title="Delayed start"
    description="start-delay waits before the first character types. Pair it with hint text so the slot never looks broken."
  >
    <div class="flex items-center gap-3">
      <p class="text-lg"><Typewriter phrases="Loading your workspace…" :start-delay="1200" /></p>
      <span class="text-muted-foreground text-xs">starts in 1.2s</span>
    </div>
  </Story>

  <Story
    title="Terminal style"
    description="Compose with font-mono on a dark panel — the caret inherits the text color via bg-current."
  >
    <div class="max-w-md rounded-lg bg-zinc-950 p-4 font-mono text-sm text-emerald-400 shadow-inner dark:bg-black/60">
      <span class="select-none">$ </span>
      <Typewriter phrases="npx shadcn-vue add https://uipkge.dev/r/vue/button.json" :typing-speed="28" />
    </div>
  </Story>

  <Story
    title="Hero heading"
    description="Drop into a heading — the caret scales with the font because its height is 1em."
  >
    <h2 class="text-4xl font-bold tracking-tight">
      Build interfaces that
      <span class="text-primary"><Typewriter :phrases="['ship.', 'scale.', 'delight.']" /></span>
    </h2>
  </Story>

  <Story
    title="AI response"
    description="A long multi-sentence phrase typed quickly in muted foreground mimics a streaming model answer."
  >
    <div class="bg-muted/40 max-w-xl rounded-lg border p-4">
      <p class="text-muted-foreground text-sm leading-relaxed">
        <Typewriter
          phrases="Sure — scaffold the page with a dashboard block, wire the KPI grid to your metrics endpoint, then swap the demo copy for real labels. Everything ships as source, so every edit stays yours."
          :typing-speed="14"
        />
      </p>
    </div>
  </Story>

  <Story title="No caret" description="show-caret=false hides the cursor entirely — useful for one-shot reveals.">
    <p class="text-lg"><Typewriter phrases="Quietly, without a cursor." :show-caret="false" /></p>
  </Story>
</template>
