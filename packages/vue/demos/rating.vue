<script setup lang="ts">
import { ref } from 'vue'
import { Rating } from '@/components/ui/rating'
const value = ref(3.5)
const sized = ref(4)
const variantValue = ref(4.5)
const tenScale = ref(7)
const reviewScore = ref(4)
const lockedRating = ref(3)
const clearableRating = ref(2)
const valued = ref(3.5)
const tooltipped = ref(3)
const integerOnly = ref(4)
</script>

<template>
  <Story title="Default" description="Star rating input with half-step support up to a max of five.">
    <div class="space-y-3">
      <Rating v-model="value" :max="5" half-increments />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ value }}</code>
      </p>
    </div>
  </Story>

  <Story title="Sizes" description="Five sizes from x-small to x-large.">
    <div class="space-y-2">
      <Rating v-model="sized" size="x-small" />
      <Rating v-model="sized" size="small" />
      <Rating v-model="sized" size="medium" />
      <Rating v-model="sized" size="large" />
      <Rating v-model="sized" size="x-large" />
    </div>
  </Story>

  <Story title="Variants" description="Outlined (default), filled, and soft background variants.">
    <div class="space-y-3">
      <Rating v-model="variantValue" variant="outlined" half-increments />
      <Rating v-model="variantValue" variant="filled" half-increments />
      <Rating v-model="variantValue" variant="soft" half-increments />
    </div>
  </Story>

  <Story title="Custom max" description="Change the number of stars with the max prop.">
    <div class="space-y-3">
      <Rating v-model="tenScale" :max="10" size="small" />
      <p class="text-muted-foreground text-xs">{{ tenScale }} / 10</p>
    </div>
  </Story>

  <Story title="Read-only" description="Non-interactive display of an existing score.">
    <div class="flex items-center gap-2">
      <Rating :model-value="4.5" :max="5" half-increments readonly />
      <span class="text-muted-foreground text-xs">(4.5 from 1,284 reviews)</span>
    </div>
  </Story>

  <Story title="Disabled" description="Visually muted and non-interactive.">
    <Rating v-model="lockedRating" :max="5" disabled />
  </Story>

  <Story title="Clearable" description="Click the currently selected star to reset to zero.">
    <div class="space-y-2">
      <Rating v-model="clearableRating" :max="5" clearable />
      <p class="text-muted-foreground text-xs">
        Click the active star to clear. Value: <code class="text-foreground">{{ clearableRating }}</code>
      </p>
    </div>
  </Story>

  <Story title="Show value" description="Display the current numeric value next to the stars.">
    <Rating v-model="valued" :max="5" half-increments show-value />
  </Story>

  <Story title="With tooltips" description="Provide one tooltip per star via the tooltips array.">
    <Rating v-model="tooltipped" :max="5" :tooltips="['Terrible', 'Poor', 'Average', 'Good', 'Excellent']" />
  </Story>

  <Story title="Integer-only" description="Omit halfIncrements to restrict input to whole stars.">
    <Rating v-model="integerOnly" :max="5" />
  </Story>

  <Story title="Hover effect" description="Stars scale up on hover for stronger feedback.">
    <Rating v-model="reviewScore" :max="5" hover />
  </Story>
</template>
