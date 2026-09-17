<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { LifeBuoy, RefreshCcw } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  code?: string
  title?: string
  description?: string
  /** Replaces the HTTP response panel. Pass `''` to hide art entirely. */
  image?: string
  imageAlt?: string
  primaryLabel?: string
  secondaryLabel?: string
  tertiaryLabel?: string
  primaryHref?: string
  secondaryHref?: string
  tertiaryHref?: string
  showPrimary?: boolean
  showSecondary?: boolean
  showTertiary?: boolean
  primaryDisabled?: boolean
  secondaryDisabled?: boolean
  tertiaryDisabled?: boolean
  onPrimary?: () => void
  onSecondary?: () => void
  onTertiary?: () => void
  /** `'page'` fills the viewport; `'contained'` fits a preview or nested panel. */
  layout?: 'page' | 'contained'
  class?: HTMLAttributes['class']
}

export type Error500Props = Props

const props = withDefaults(defineProps<Props>(), {
  image: '/illustrations/error-500.jpg',
  imageAlt: '',
  showPrimary: true,
  showSecondary: true,
  showTertiary: true,
  primaryDisabled: false,
  secondaryDisabled: false,
  tertiaryDisabled: false,
  layout: 'page',
})

const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)

const code = computed(() => copy('500', props.code))
const title = computed(() => copy('Something went wrong', props.title))
const description = computed(() =>
  copy(
    'We hit an unexpected error on our side. Try again in a moment — if it keeps happening, our team is on it.',
    props.description,
  ),
)
const primaryLabel = computed(() => copy('Try again', props.primaryLabel))
const secondaryLabel = computed(() => copy('Back to home', props.secondaryLabel))
const tertiaryLabel = computed(() => copy('Contact support', props.tertiaryLabel))
</script>

<template>
  <section
    data-slot="error-500"
    :data-layout="layout"
    :class="
      cn(
        'bg-background relative flex items-center overflow-hidden px-6 py-16',
        layout === 'page' ? 'min-h-svh' : 'min-h-[28rem]',
        props.class,
      )
    "
  >
    <div class="mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <p v-if="code" class="text-muted-foreground text-sm font-medium">HTTP {{ code }}</p>
        <p v-if="code" class="mt-3 text-6xl font-semibold tracking-tighter sm:text-7xl">{{ code }}</p>
        <h1 class="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{{ title }}</h1>
        <p v-if="description" class="text-muted-foreground mt-4 max-w-md text-base">{{ description }}</p>
        <div v-if="showPrimary || showSecondary || showTertiary" class="mt-8 flex flex-wrap items-center gap-3">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            size="lg"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            <RefreshCcw />
            {{ primaryLabel }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            size="lg"
            variant="outline"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondaryLabel }}
          </Button>
          <Button
            v-if="showTertiary"
            :as="tertiaryHref ? 'a' : 'button'"
            :href="tertiaryHref"
            size="lg"
            variant="ghost"
            :disabled="tertiaryDisabled"
            @click="onTertiary?.()"
          >
            {{ tertiaryLabel }}
            <LifeBuoy />
          </Button>
        </div>
      </div>
      <div v-if="image" class="border-border bg-muted overflow-hidden rounded-xl border">
        <img :src="image" :alt="imageAlt" class="aspect-[4/3] w-full object-cover" />
      </div>
      <div
        v-else-if="image === undefined"
        class="border-border bg-muted/40 overflow-hidden rounded-xl border font-mono"
        aria-hidden="true"
      >
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">POST /api/v1/invoices</div>
        <div class="space-y-1 p-4 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-destructive">{{ code || '500' }} Internal Server Error</span>
          </p>
          <p class="text-muted-foreground">error: ECONNRESET</p>
          <p class="text-muted-foreground">at: Worker.run:142</p>
          <p class="text-muted-foreground">x-request-id: req_8f3c2a</p>
        </div>
      </div>
    </div>
  </section>
</template>
