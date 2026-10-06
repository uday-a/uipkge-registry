<script lang="ts">
  import { GradientText } from '@svelte-registry/gradient-text'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Sunset preset'}
  <p class="text-3xl font-bold">
    <GradientText preset="sunset">Beautiful Gradient</GradientText>
  </p>
{/if}

{#if story === 'Ocean preset'}
  <p class="text-3xl font-bold">
    <GradientText preset="ocean">Ocean Breeze</GradientText>
  </p>
{/if}

{#if story === 'Forest preset'}
  <p class="text-3xl font-bold">
    <GradientText preset="forest">Forest Canopy</GradientText>
  </p>
{/if}

{#if story === 'Rainbow preset'}
  <p class="text-3xl font-bold">
    <GradientText preset="rainbow">Rainbow Text</GradientText>
  </p>
{/if}

{#if story === 'All presets'}
  <div class="flex flex-wrap gap-x-6 gap-y-2 text-xl font-bold">
    <GradientText preset="sunset">sunset</GradientText>
    <GradientText preset="ocean">ocean</GradientText>
    <GradientText preset="forest">forest</GradientText>
    <GradientText preset="fire">fire</GradientText>
    <GradientText preset="candy">candy</GradientText>
    <GradientText preset="aurora">aurora</GradientText>
    <GradientText preset="gold">gold</GradientText>
    <GradientText preset="neon">neon</GradientText>
    <GradientText preset="grape">grape</GradientText>
  </div>
{/if}

{#if story === 'Custom from/to'}
  <p class="text-3xl font-bold">
    <GradientText from="#7c3aed" to="#ec4899">Custom Colors</GradientText>
  </p>
{/if}

{#if story === 'Direction'}
  <div class="space-y-2 text-2xl font-bold">
    <GradientText from="#7c3aed" to="#ec4899" direction="to bottom">to bottom</GradientText>
    <GradientText from="#7c3aed" to="#ec4899" direction="to top right">to top right</GradientText>
    <GradientText from="#7c3aed" to="#ec4899" direction="to bottom left">to bottom left</GradientText>
  </div>
{/if}

{#if story === 'Custom gradient'}
  <p class="text-3xl font-bold">
    <GradientText gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed)">
      Four-Stop Angled
    </GradientText>
  </p>
{/if}

{#if story === 'Animated'}
  <p class="text-3xl font-bold">
    <GradientText preset="aurora" animated>Animated Gradient</GradientText>
  </p>
{/if}

{#if story === 'Animated presets'}
  <div class="space-y-3">
    <p class="text-2xl font-bold"><GradientText preset="aurora" animated>Aurora Flow</GradientText></p>
    <p class="text-2xl font-bold"><GradientText preset="rainbow" animated>Rainbow Flow</GradientText></p>
    <p class="text-2xl font-bold"><GradientText preset="sunset" animated>Sunset Flow</GradientText></p>
    <p class="text-2xl font-bold"><GradientText preset="ocean" animated>Ocean Flow</GradientText></p>
    <p class="text-2xl font-bold"><GradientText preset="fire" animated>Fire Flow</GradientText></p>
    <p class="text-2xl font-bold"><GradientText preset="neon" animated>Neon Flow</GradientText></p>
  </div>
{/if}

{#if story === 'Animation speed'}
  <div class="space-y-3">
    <p class="text-2xl font-bold">
      <GradientText preset="aurora" animated animationDuration={2}>2s — Fast</GradientText>
    </p>
    <p class="text-2xl font-bold">
      <GradientText preset="aurora" animated animationDuration={4}>4s — Default</GradientText>
    </p>
    <p class="text-2xl font-bold">
      <GradientText preset="aurora" animated animationDuration={8}>8s — Slow</GradientText>
    </p>
  </div>
{/if}

{#if story === 'Animated custom gradient'}
  <p class="text-3xl font-bold">
    <GradientText
      gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed, #f12711)"
      animated
      animationDuration={3}
    >
      Four-Stop Flowing
    </GradientText>
  </p>
{/if}

{#if story === 'Animated inline'}
  <p class="text-base">
    This sentence has an
    <GradientText preset="fire" animated class="font-semibold">animated highlight</GradientText>
    that flows continuously, plus a
    <GradientText preset="ocean" animated animationDuration={6} class="font-semibold">slower one</GradientText>
    for contrast.
  </p>
{/if}

{#if story === 'Inline in a sentence'}
  <p class="text-base">
    You can highlight <GradientText preset="fire" class="font-semibold">specific words</GradientText> inside a normal
    sentence using <GradientText from="#10b981" to="#3b82f6" class="font-semibold">custom colors</GradientText>.
  </p>
{/if}

{#if story === 'As heading'}
  <GradientText as="h1" preset="grape" class="text-4xl font-bold">Heading Gradient</GradientText>
{/if}
