<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { ArrowLeft, LifeBuoy } from 'lucide-vue-next'
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
  primaryHref?: string
  secondaryHref?: string
  showPrimary?: boolean
  showSecondary?: boolean
  primaryDisabled?: boolean
  secondaryDisabled?: boolean
  onPrimary?: () => void
  onSecondary?: () => void
  /** `'page'` fills the viewport; `'contained'` fits a preview or nested panel. */
  layout?: 'page' | 'contained'
  class?: HTMLAttributes['class']
}

export type Error404Props = Props

const props = withDefaults(defineProps<Props>(), {
  image: '/illustrations/error-404.jpg',
  imageAlt: '',
  showPrimary: true,
  showSecondary: true,
  primaryDisabled: false,
  secondaryDisabled: false,
  layout: 'page',
})

const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)

const code = computed(() => copy('404', props.code))
const title = computed(() => copy('Page not found', props.title))
const description = computed(() =>
  copy(
    "The page you're looking for doesn't exist or may have been moved. Check the URL or head back home.",
    props.description,
  ),
)
const primaryLabel = computed(() => copy('Back to home', props.primaryLabel))
const secondaryLabel = computed(() => copy('Contact support', props.secondaryLabel))
</script>

<template>
  <section
    data-slot="error-404"
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
        <div v-if="showPrimary || showSecondary" class="mt-8 flex flex-wrap items-center gap-3">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            size="lg"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            <ArrowLeft />
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
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
          curl -i https://app.acme.dev/pricing/teams
        </div>
        <div class="space-y-1 p-4 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}{{ code || '404' }} Not Found</p>
          <p class="text-muted-foreground">content-type: application/json</p>
          <p class="text-muted-foreground">x-request-id: req_9k2e18</p>
          <p class="text-muted-foreground mt-3">{ "error": "not_found", "path": "/pricing/teams" }</p>
        </div>
      </div>
    </div>
  </section>
</template>
