<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SignaturePad } from '@/components/ui/signature-pad'
import { Check, Download, Eraser, PenLine } from 'lucide-vue-next'

const signature = ref<string | null>(null)
const padRef = ref<InstanceType<typeof SignaturePad> | null>(null)
const penColor = ref('#1d4ed8')
const penThickness = ref(3)
const bgColor = ref('#ffffff')
</script>

<template>
  <Story
    title="Default pad"
    description="Standard signature capture with a built-in clear button and live point count."
  >
    <div class="max-w-md space-y-2">
      <SignaturePad v-model="signature" class="w-full" />
      <p class="text-muted-foreground text-xs">
        {{ signature ? 'Signature captured' : 'No signature yet' }}
      </p>
    </div>
  </Story>

  <Story
    title="Styled ink"
    description="Blue pen with a thicker stroke on a tinted background — common for legal documents."
  >
    <div class="max-w-md space-y-2">
      <SignaturePad
        v-model="signature"
        pen-color="#1d4ed8"
        :pen-thickness="3"
        background-color="#f8fafc"
        class="w-full"
      />
      <p class="text-muted-foreground text-xs">Blue ink, thickness 3, light slate background.</p>
    </div>
  </Story>

  <Story
    title="Live config"
    description="Adjust pen color, thickness, and background at runtime to preview different styles."
  >
    <div class="max-w-md space-y-4">
      <div class="flex flex-wrap items-center gap-4 text-sm">
        <label class="flex items-center gap-2">
          Pen
          <input v-model="penColor" type="color" class="size-7 cursor-pointer rounded border" />
        </label>
        <label class="flex items-center gap-2">
          BG
          <input v-model="bgColor" type="color" class="size-7 cursor-pointer rounded border" />
        </label>
        <label class="flex items-center gap-2">
          Thickness
          <input v-model.number="penThickness" type="range" min="1" max="6" class="w-28" />
          <span class="text-muted-foreground tabular-nums">{{ penThickness }}</span>
        </label>
      </div>
      <SignaturePad
        v-model="signature"
        :pen-color="penColor"
        :pen-thickness="penThickness"
        :background-color="bgColor"
        class="w-full"
      />
      <p v-if="signature" class="flex items-center gap-1 text-xs text-emerald-600">
        <Check class="size-3.5" /> Captured
      </p>
    </div>
  </Story>

  <Story
    title="Programmatic control"
    description="Use a template ref to clear and export without the built-in button. Shows isEmpty and pointCount."
  >
    <div class="max-w-md space-y-3">
      <SignaturePad ref="padRef" v-model="signature" :show-clear-button="false" class="w-full" />
      <div class="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" @click="padRef?.clear()">
          <Eraser class="size-4" />
          Clear
        </Button>
        <Button size="sm" @click="padRef?.exportSignature()">
          <Download class="size-4" />
          Export
        </Button>
      </div>
      <p class="text-muted-foreground text-xs">
        Empty: {{ padRef?.isEmpty ? 'yes' : 'no' }} · Points: {{ padRef?.pointCount ?? 0 }}
      </p>
    </div>
  </Story>

  <Story title="States" description="Disabled blocks all interaction; readonly shows existing ink but prevents edits.">
    <div class="max-w-md space-y-3">
      <SignaturePad v-model="signature" disabled class="w-full" />
      <SignaturePad v-model="signature" readonly class="w-full" />
    </div>
  </Story>

  <Story
    title="In context: Contract signing"
    description="A realistic agreement card with terms text, a signature pad, and a custom actions slot for submit."
  >
    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Sign your agreement</CardTitle>
        <CardDescription>By signing below, you accept the terms of service and privacy policy.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <p class="text-muted-foreground text-sm leading-relaxed">
          This agreement is effective upon signing. Your signature below confirms that you have read and understood all
          terms outlined in the contract.
        </p>
        <SignaturePad v-model="signature" :show-clear-button="false" class="w-full">
          <template #actions="{ clear, empty }">
            <div class="flex items-center justify-between pt-2">
              <Button size="sm" variant="ghost" :disabled="empty" @click="clear">
                <PenLine class="size-4" />
                Reset
              </Button>
              <Button size="sm" :disabled="empty">
                <Check class="size-4" />
                Submit signature
              </Button>
            </div>
          </template>
        </SignaturePad>
      </CardContent>
    </Card>
  </Story>
</template>
