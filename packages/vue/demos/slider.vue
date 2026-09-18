<script setup lang="ts">
import { ref } from 'vue'
import { Slider } from '@/components/ui/slider'
const single = ref(50)
const singleArray = ref([40])
const rangeValue = ref([20, 80])
const stepped = ref([30])
const disabledVal = ref([60])
const reversed = ref([30])
const includedOff = ref([40])
const marksValue = ref([37])
const dotsValue = ref([30])
const verticalVal = ref([30])
const smallVal = ref([25])
const tooltipCustom = ref([50])

const marks = {
  0: '0°C',
  26: '26°C',
  37: '37°C',
  50: '50°C',
  100: {
    label: '100°C',
    style: { color: '#f50' },
  },
}

const formatter = (val: number) => `${val}%`
</script>

<template>
  <Story title="Default (single thumb)" description="Number model — the simplest single-thumb slider.">
    <div class="max-w-md space-y-3">
      <Slider v-model="single" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ single }}</code>
      </p>
    </div>
  </Story>

  <Story title="Backward-compat array" description="Array model preserved for existing consumers.">
    <div class="max-w-md space-y-3">
      <Slider v-model="singleArray" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ singleArray[0] }}</code>
      </p>
    </div>
  </Story>

  <Story title="Range" description="Dual-thumb range selection with range prop.">
    <div class="max-w-md space-y-3">
      <Slider v-model="rangeValue" range :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ rangeValue.join(' – ') }}</code>
      </p>
    </div>
  </Story>

  <Story title="With step" description="step=10 snaps to multiples of 10.">
    <div class="max-w-md space-y-3">
      <Slider v-model="stepped" :max="100" :step="10" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ stepped[0] }}</code>
      </p>
    </div>
  </Story>

  <Story title="Disabled" description="Non-interactive state with reduced opacity.">
    <div class="max-w-md">
      <Slider v-model="disabledVal" :max="100" :step="1" disabled />
    </div>
  </Story>

  <Story title="Small size" description="Compact track and thumb.">
    <div class="max-w-md space-y-3">
      <Slider v-model="smallVal" size="small" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ smallVal }}</code>
      </p>
    </div>
  </Story>

  <Story title="Reverse" description="Right-to-left rendering using reverse prop.">
    <div class="max-w-md space-y-3">
      <Slider v-model="reversed" reverse :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ reversed }}</code>
      </p>
    </div>
  </Story>

  <Story title="Included = false" description="Track fill hidden; only thumbs are visible.">
    <div class="max-w-md space-y-3">
      <Slider v-model="includedOff" :included="false" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ includedOff[0] }}</code>
      </p>
    </div>
  </Story>

  <Story title="Dots" description="Show dots at every step position.">
    <div class="max-w-md space-y-3">
      <Slider v-model="dotsValue" dots :max="100" :step="10" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ dotsValue[0] }}</code>
      </p>
    </div>
  </Story>

  <Story title="Marks" description="Custom labels at specific values.">
    <div class="max-w-md space-y-6">
      <Slider v-model="marksValue" :marks="marks" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ marksValue[0] }}</code>
      </p>
    </div>
  </Story>

  <Story title="Marks + dots + included" description="Combined marks, dots and filled track.">
    <div class="max-w-md space-y-6">
      <Slider v-model="marksValue" dots :marks="marks" :max="100" :step="10" />
    </div>
  </Story>

  <Story title="Tooltip formatter" description="Custom tooltip text via formatter function.">
    <div class="max-w-md space-y-3">
      <Slider v-model="tooltipCustom" :tooltip="formatter" :max="100" :step="1" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ tooltipCustom }}</code>
      </p>
    </div>
  </Story>

  <Story title="No tooltip" description="Tooltip hidden with tooltip=false.">
    <div class="max-w-md">
      <Slider v-model="single" :tooltip="false" :max="100" :step="1" />
    </div>
  </Story>

  <Story title="Vertical" description="Vertical orientation with height prop.">
    <div class="flex gap-8">
      <Slider v-model="verticalVal" vertical :height="160" :max="100" :step="1" />
      <p class="text-muted-foreground self-end text-xs">
        Value:
        <code class="text-foreground">{{ verticalVal }}</code>
      </p>
    </div>
  </Story>

  <Story title="Vertical with marks" description="Vertical slider + marks + dots.">
    <div class="flex gap-8">
      <Slider
        v-model="verticalVal"
        vertical
        dots
        :height="160"
        :marks="{
          0: '0',
          50: '50',
          100: '100',
        }"
        :max="100"
        :step="10"
      />
      <p class="text-muted-foreground self-end text-xs">
        Value:
        <code class="text-foreground">{{ verticalVal }}</code>
      </p>
    </div>
  </Story>
</template>
