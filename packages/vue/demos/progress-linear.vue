<script setup lang="ts">
import { ProgressLinear } from "@/components/ui/progress-linear";
</script>

<template>
  <Story
    title="Determinate"
    description="Linear progress bar driven by a fixed model value (0–100)."
  >
    <div class="max-w-md">
      <ProgressLinear :model-value="60" />
    </div>
  </Story>

  <Story
    title="Indeterminate"
    description="indeterminate animates a sliding bar for unknown-duration tasks."
  >
    <div class="max-w-md">
      <ProgressLinear indeterminate />
    </div>
  </Story>

  <Story
    title="Buffer"
    description="buffer renders a secondary fill behind the main value — useful for pre-loading or video buffering."
  >
    <div class="max-w-md">
      <ProgressLinear :model-value="35" :buffer="65" />
    </div>
  </Story>

  <Story
    title="Stream"
    description="stream animates a dotted overlay on the track (determinate only — disabled while indeterminate)."
  >
    <div class="max-w-md">
      <ProgressLinear :model-value="40" stream :buffer="70" />
    </div>
  </Story>

  <Story
    title="Striped"
    description="striped paints diagonal hatch marks on the fill for a loading aesthetic."
  >
    <div class="max-w-md space-y-3">
      <ProgressLinear :model-value="70" striped />
      <ProgressLinear :model-value="45" striped color="var(--info)" />
    </div>
  </Story>

  <Story
    title="Color tokens"
    description="color accepts a CSS color or a token name (primary / success / warning / info / destructive)."
  >
    <div class="max-w-md space-y-3">
      <ProgressLinear :model-value="60" color="var(--success)" />
      <ProgressLinear :model-value="40" color="var(--warning)" />
      <ProgressLinear :model-value="20" color="var(--destructive)" />
      <ProgressLinear :model-value="80" color="var(--info)" />
    </div>
  </Story>

  <Story
    title="Heights"
    description="height (px or any CSS length) tunes the track thickness from a hairline to a chunky bar."
  >
    <div class="max-w-md space-y-3">
      <ProgressLinear :model-value="60" :height="2" />
      <ProgressLinear :model-value="60" :height="4" />
      <ProgressLinear :model-value="60" :height="8" />
      <ProgressLinear :model-value="60" :height="14" rounded="full" />
    </div>
  </Story>

  <Story
    title="Reverse"
    description="reverse fills from right-to-left — useful for RTL UIs or count-down semantics."
  >
    <div class="max-w-md">
      <ProgressLinear :model-value="35" reverse />
    </div>
  </Story>
</template>
