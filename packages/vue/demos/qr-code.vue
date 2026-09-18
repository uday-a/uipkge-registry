<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { QRCode } from '@/components/ui/qr-code'
const basicValue = ref('https://uipkge.dev')
const customValue = ref('https://github.com/uday-a/nuxt-boilerplate')
const iconValue = ref('https://uipkge.dev')
const longValue = ref('https://uipkge.dev/components/qr-code?demo=true&source=github&ref=main')

const statuses = ['active', 'expired', 'loading', 'scanned'] as const
const currentStatus = ref<(typeof statuses)[number]>('active')

const colors = [
  { color: '#000000', bgColor: '#ffffff', label: 'Default' },
  { color: '#1677ff', bgColor: '#ffffff', label: 'Blue' },
  { color: '#52c41a', bgColor: '#ffffff', label: 'Green' },
  { color: '#fa8c16', bgColor: '#ffffff', label: 'Orange' },
  { color: '#eb2f96', bgColor: '#ffffff', label: 'Pink' },
  { color: '#722ed1', bgColor: '#ffffff', label: 'Purple' },
]

const errorLevels = ['L', 'M', 'Q', 'H'] as const

function onRefresh() {
  alert('Refresh triggered!')
}
</script>

<template>
  <Story title="Basic" description="Default QR code with URL value.">
    <QRCode :value="basicValue" />
  </Story>

  <Story title="Sizes" description="Different sizes from small to large.">
    <div class="flex flex-wrap items-end gap-4">
      <QRCode :value="basicValue" :size="80" />
      <QRCode :value="basicValue" :size="120" />
      <QRCode :value="basicValue" :size="160" />
      <QRCode :value="basicValue" :size="200" />
    </div>
  </Story>

  <Story title="Custom Colors" description="Foreground and background color combinations.">
    <div class="flex flex-wrap gap-4">
      <div v-for="c in colors" :key="c.label" class="flex flex-col items-center gap-1">
        <QRCode :value="basicValue" :color="c.color" :bg-color="c.bgColor" :size="100" />
        <span class="text-muted-foreground text-xs">{{ c.label }}</span>
      </div>
    </div>
  </Story>

  <Story title="SVG Type" description="Render as SVG instead of canvas.">
    <div class="flex gap-4">
      <QRCode :value="basicValue" type="canvas" />
      <QRCode :value="basicValue" type="svg" />
    </div>
  </Story>

  <Story title="With Icon" description="Embed a logo or icon in the center.">
    <QRCode :value="iconValue" icon="https://github.com/uday-a.png" :icon-size="40" error-level="H" />
  </Story>

  <Story title="Error Levels" description="Different error correction levels (L/M/Q/H). Higher = more robust.">
    <div class="flex flex-wrap gap-4">
      <div v-for="level in errorLevels" :key="level" class="flex flex-col items-center gap-1">
        <QRCode :value="longValue" :error-level="level" :size="120" />
        <span class="text-muted-foreground text-xs">Level {{ level }}</span>
      </div>
    </div>
  </Story>

  <Story title="Borderless" description="Without the default border and padding.">
    <QRCode :value="basicValue" :bordered="false" />
  </Story>

  <Story title="Margin / Quiet Zone" description="Add quiet zone around the QR code.">
    <div class="flex gap-4">
      <QRCode :value="basicValue" :margin-size="0" :size="120" />
      <QRCode :value="basicValue" :margin-size="2" :size="120" />
      <QRCode :value="basicValue" :margin-size="4" :size="120" />
    </div>
  </Story>

  <Story title="Status" description="Active, expired, loading, and scanned states.">
    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <Button
          v-for="s in statuses"
          :key="s"
          size="sm"
          :variant="currentStatus === s ? 'default' : 'outline'"
          @click="currentStatus = s"
        >
          {{ s }}
        </Button>
      </div>
      <QRCode :value="customValue" :status="currentStatus" @refresh="onRefresh" />
    </div>
  </Story>

  <Story title="Long URL" description="Dense QR code from a long URL. Use larger size or higher error level.">
    <div class="flex flex-col items-start gap-2">
      <QRCode :value="longValue" :size="200" error-level="H" />
      <p class="text-muted-foreground max-w-md truncate text-xs">{{ longValue }}</p>
    </div>
  </Story>

  <Story title="Download" description="Click the download link to save the QR code as PNG.">
    <QRCode :value="basicValue" />
  </Story>

  <Story title="Custom Content" description="Use the #extra slot for custom actions.">
    <QRCode :value="basicValue">
      <template #extra>
        <div class="flex items-center gap-2">
          <Button size="sm" variant="outline" @click="basicValue = 'https://uipkge.dev/components/advance-select'">
            Change URL
          </Button>
          <Button size="sm" variant="outline" @click="basicValue = 'https://uipkge.dev'"> Reset </Button>
        </div>
      </template>
    </QRCode>
  </Story>
</template>
