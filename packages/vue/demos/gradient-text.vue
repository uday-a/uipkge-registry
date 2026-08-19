<script setup lang="ts">
import { GradientText } from "@/components/ui/gradient-text";
</script>

<template>
  <Story
    title="Sunset preset"
    description="preset='sunset' applies a warm orange-to-peach gradient."
  >
    <p class="text-3xl font-bold">
      <GradientText preset="sunset">Beautiful Gradient</GradientText>
    </p>
  </Story>

  <Story
    title="Ocean preset"
    description="preset='ocean' applies a teal-to-light-blue gradient."
  >
    <p class="text-3xl font-bold">
      <GradientText preset="ocean">Ocean Breeze</GradientText>
    </p>
  </Story>

  <Story
    title="Forest preset"
    description="preset='forest' applies a deep-green-to-lime gradient."
  >
    <p class="text-3xl font-bold">
      <GradientText preset="forest">Forest Canopy</GradientText>
    </p>
  </Story>

  <Story
    title="Rainbow preset"
    description="preset='rainbow' spans the full spectrum."
  >
    <p class="text-3xl font-bold">
      <GradientText preset="rainbow">Rainbow Text</GradientText>
    </p>
  </Story>

  <Story title="All presets" description="Every preset gradient in one row.">
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
  </Story>

  <Story
    title="Custom from/to"
    description="from and to define a two-stop gradient."
  >
    <p class="text-3xl font-bold">
      <GradientText from="#7c3aed" to="#ec4899">Custom Colors</GradientText>
    </p>
  </Story>

  <Story title="Direction" description="direction controls the gradient axis.">
    <div class="space-y-2 text-2xl font-bold">
      <GradientText from="#7c3aed" to="#ec4899" direction="to bottom"
        >to bottom</GradientText
      >
      <GradientText from="#7c3aed" to="#ec4899" direction="to top right"
        >to top right</GradientText
      >
      <GradientText from="#7c3aed" to="#ec4899" direction="to bottom left"
        >to bottom left</GradientText
      >
    </div>
  </Story>

  <Story
    title="Custom gradient"
    description="gradient accepts any full CSS gradient string (multi-stop, angled)."
  >
    <p class="text-3xl font-bold">
      <GradientText
        gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed)"
      >
        Four-Stop Angled
      </GradientText>
    </p>
  </Story>

  <Story
    title="Animated"
    description="animated shifts the background position for a flowing effect."
  >
    <p class="text-3xl font-bold">
      <GradientText preset="aurora" animated>Animated Gradient</GradientText>
    </p>
  </Story>

  <Story
    title="Animated presets"
    description="All presets with the animated flag — each flows continuously."
  >
    <div class="space-y-3">
      <p class="text-2xl font-bold">
        <GradientText preset="aurora" animated>Aurora Flow</GradientText>
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="rainbow" animated>Rainbow Flow</GradientText>
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="sunset" animated>Sunset Flow</GradientText>
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="ocean" animated>Ocean Flow</GradientText>
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="fire" animated>Fire Flow</GradientText>
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="neon" animated>Neon Flow</GradientText>
      </p>
    </div>
  </Story>

  <Story
    title="Animation speed"
    description="animationDuration controls the flow speed (2s fast, 4s default, 8s slow)."
  >
    <div class="space-y-3">
      <p class="text-2xl font-bold">
        <GradientText preset="aurora" animated :animation-duration="2"
          >2s — Fast</GradientText
        >
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="aurora" animated :animation-duration="4"
          >4s — Default</GradientText
        >
      </p>
      <p class="text-2xl font-bold">
        <GradientText preset="aurora" animated :animation-duration="8"
          >8s — Slow</GradientText
        >
      </p>
    </div>
  </Story>

  <Story
    title="Animated custom gradient"
    description="Multi-stop custom gradients animate beautifully."
  >
    <p class="text-3xl font-bold">
      <GradientText
        gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed, #f12711)"
        animated
        :animation-duration="3"
      >
        Four-Stop Flowing
      </GradientText>
    </p>
  </Story>

  <Story
    title="Animated inline"
    description="Animated gradients work inline too — great for highlighting key terms."
  >
    <p class="text-base">
      This sentence has an
      <GradientText preset="fire" animated class="font-semibold"
        >animated highlight</GradientText
      >
      that flows continuously, plus a
      <GradientText
        preset="ocean"
        animated
        :animation-duration="6"
        class="font-semibold"
        >slower one</GradientText
      >
      for contrast.
    </p>
  </Story>

  <Story
    title="Inline in a sentence"
    description="GradientText renders inline so it blends into surrounding text."
  >
    <p class="text-base">
      You can highlight
      <GradientText preset="fire" class="font-semibold"
        >specific words</GradientText
      >
      inside a normal sentence using
      <GradientText from="#10b981" to="#3b82f6" class="font-semibold"
        >custom colors</GradientText
      >.
    </p>
  </Story>

  <Story
    title="As heading"
    description="Use as='h1' (via Primitive) to render a semantic heading with gradient."
  >
    <GradientText as="h1" preset="grape" class="text-4xl font-bold"
      >Heading Gradient</GradientText
    >
  </Story>
</template>
