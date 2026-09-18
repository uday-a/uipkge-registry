<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
const basic = ref(5)
const sized = ref(10)
const statused = ref(20)
const formatted = ref(1000)
const precisioned = ref(3.14159)
const rightControls = ref(50)
const keyboardOff = ref(25)
const prefixed = ref(100)
const bounded = ref(5)
</script>

<template>
  <Story
    title="Default"
    description="Basic numeric input with increment and decrement buttons, bounded by min and max."
  >
    <div class="max-w-xs space-y-2">
      <Label for="qty">Quantity</Label>
      <NumberField id="qty" v-model="basic" :min="0" :max="20">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Sizes" description="Small, middle (default), and large sizes.">
    <div class="flex items-center gap-4">
      <NumberField v-model="sized" size="small" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <NumberField v-model="sized" size="middle" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <NumberField v-model="sized" size="large" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Status" description="Error and warning validation states.">
    <div class="flex items-center gap-4">
      <NumberField v-model="statused" status="error" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <NumberField v-model="statused" status="warning" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Formatter / Parser" description="Display formatting with custom formatter and parser functions.">
    <div class="max-w-xs space-y-2">
      <Label>Price</Label>
      <NumberField
        v-model="formatted"
        prefix="$"
        :formatter="(v) => v?.toLocaleString() ?? ''"
        :parser="(v) => Number(v.replace(/[^0-9.-]/g, ''))"
      >
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Precision" description="Fixed decimal places using the precision prop.">
    <div class="max-w-xs space-y-2">
      <Label>Pi (3 decimals)</Label>
      <NumberField v-model="precisioned" :precision="3" :step="0.001">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Controls position right" description="Stacked increment and decrement buttons on the right.">
    <div class="max-w-xs space-y-2">
      <Label>Amount</Label>
      <NumberField v-model="rightControls" controls-position="right" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Keyboard disabled" description="Arrow keys do not change the value when keyboard is false.">
    <div class="max-w-xs space-y-2">
      <Label>Manual only</Label>
      <NumberField v-model="keyboardOff" :keyboard="false" :min="0">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Prefix &amp; Suffix" description="Add text or icons before and after the input value.">
    <div class="flex items-center gap-4">
      <NumberField v-model="prefixed" prefix="$">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <NumberField v-model="prefixed" suffix="%">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Min / Max bounds" description="Buttons visually disable when reaching boundaries.">
    <div class="max-w-xs space-y-2">
      <Label>Bounded (0 – 10)</Label>
      <NumberField v-model="bounded" :min="0" :max="10">
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>

  <Story title="Disabled &amp; Read-only" description="Non-interactive states.">
    <div class="flex items-center gap-4">
      <NumberField :model-value="42" disabled>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <NumberField :model-value="42" readonly>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
    </div>
  </Story>
</template>
