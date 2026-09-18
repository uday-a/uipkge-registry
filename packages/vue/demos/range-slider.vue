<script setup lang="ts">
import { ref } from 'vue'
import { RangeSlider } from '@/components/ui/range-slider'
const value = ref<[number, number]>([20, 80])
const ticked = ref<[number, number]>([25, 75])
const stepped = ref<[number, number]>([10, 40])
const labeled = ref<[number, number]>([30, 70])
const priced = ref<[number, number]>([100, 750])
const colored = ref<[number, number]>([20, 80])
const small = ref<[number, number]>([20, 80])
const large = ref<[number, number]>([20, 80])
const errored = ref<[number, number]>([60, 40])
const locked = ref<[number, number]>([25, 75])
const inverted = ref<[number, number]>([20, 80])

const currency = (n: number) => `$${n}`
const percent = (n: number) => `${n}%`
</script>

<template>
  <Story title="Default" description="Two-handle slider for selecting a numeric range bounded by min and max.">
    <div class="max-w-md space-y-3">
      <RangeSlider v-model="value" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ value.join(' – ') }}</code>
      </p>
    </div>
  </Story>

  <Story title="With ticks" description="Render tick marks at regular intervals with showTicks and tickInterval.">
    <div class="max-w-md space-y-3">
      <RangeSlider v-model="ticked" :max="100" :step="1" show-ticks :tick-interval="25" />
    </div>
  </Story>

  <Story
    title="Custom step + tick interval"
    description="Quantize values with step and align ticks to a different interval."
  >
    <div class="max-w-md space-y-3">
      <RangeSlider v-model="stepped" :min="0" :max="50" :step="5" show-ticks :tick-interval="10" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ stepped.join(' – ') }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Always-visible thumb labels"
    description="Pass thumbLabel to keep the value bubble pinned above each handle."
  >
    <div class="max-w-md space-y-6">
      <RangeSlider v-model="labeled" :max="100" thumb-label />
    </div>
  </Story>

  <Story
    title="Custom format (currency)"
    description="Use thumbLabelFormat to render formatted values in the thumb bubble."
  >
    <div class="max-w-md space-y-6">
      <RangeSlider v-model="priced" :min="0" :max="1000" :step="50" thumb-label :thumb-label-format="currency" />
    </div>
  </Story>

  <Story title="Color variants" description="Use the color prop to recolor the active range.">
    <div class="max-w-md space-y-4">
      <RangeSlider v-model="colored" :max="100" color="primary" />
      <RangeSlider v-model="colored" :max="100" color="success" />
      <RangeSlider v-model="colored" :max="100" color="warning" />
      <RangeSlider v-model="colored" :max="100" color="error" />
      <RangeSlider v-model="colored" :max="100" color="info" />
    </div>
  </Story>

  <Story title="Sizes" description="Combine thumbSize and trackHeight to scale the slider up or down.">
    <div class="max-w-md space-y-4">
      <RangeSlider v-model="small" :max="100" thumb-size="sm" track-height="sm" />
      <RangeSlider v-model="value" :max="100" thumb-size="md" track-height="md" />
      <RangeSlider v-model="large" :max="100" thumb-size="lg" track-height="lg" />
    </div>
  </Story>

  <Story title="With label and hint" description="Pass label and hint props for an embedded form-field layout.">
    <div class="max-w-md space-y-3">
      <RangeSlider
        v-model="labeled"
        :max="100"
        label="Volume"
        hint="Drag either handle to set the range."
        thumb-label
        :thumb-label-format="percent"
      />
    </div>
  </Story>

  <Story title="Error state" description="Set error or pass errorMessages to surface validation issues.">
    <div class="max-w-md space-y-3">
      <RangeSlider
        v-model="errored"
        :max="100"
        label="Acceptable range"
        error
        error-messages="Lower bound must be below upper bound."
      />
    </div>
  </Story>

  <Story title="Disabled" description="Lock the slider via disabled.">
    <div class="max-w-md space-y-3">
      <RangeSlider v-model="locked" :max="100" disabled />
    </div>
  </Story>

  <Story title="Inverted" description="Flip the active range direction with inverted.">
    <div class="max-w-md space-y-3">
      <RangeSlider v-model="inverted" :max="100" inverted />
    </div>
  </Story>
</template>
