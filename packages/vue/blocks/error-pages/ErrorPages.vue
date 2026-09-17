<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { Clock, RotateCcw } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type ErrorPagesVariant = '404' | '500' | '403' | 'maintenance'

interface Props {
  /** `'all'` renders the full gallery; a single variant renders just that screen. */
  variant?: ErrorPagesVariant | 'all'
  size?: 'sm' | 'default'
  class?: HTMLAttributes['class']
  title?: string
  description?: string
  /** Status numeral. Pass `''` to hide. */
  code?: string
  /** Eyebrow pill (maintenance ETA by default). Pass `''` to hide. */
  tag?: string
  /** Replaces the HTTP response panel on a single variant. Pass `''` to hide art. */
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
  onHome?: () => void
  onSearch?: () => void
  onRetry?: () => void
  onStatus?: () => void
  onSwitchAccount?: () => void
  onRequestAccess?: () => void
  onSubscribe?: () => void
}

export type ErrorPagesProps = Props

const props = withDefaults(defineProps<Props>(), {
  variant: 'all',
  size: 'default',
  imageAlt: '',
  showPrimary: true,
  showSecondary: true,
  primaryDisabled: false,
  secondaryDisabled: false,
})

const show = (v: ErrorPagesVariant) => props.variant === 'all' || props.variant === v
const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)
const forVariant = (v: ErrorPagesVariant, fallback: string, override?: string) =>
  props.variant === v ? copy(fallback, override) : fallback

const title404 = computed(() => forVariant('404', 'Page not found', props.title))
const desc404 = computed(() =>
  forVariant(
    '404',
    "The page you're looking for doesn't exist or was moved. Check the URL or head back home.",
    props.description,
  ),
)
const code404 = computed(() => forVariant('404', '404', props.code))
const image404 = computed(() => forVariant('404', '/illustrations/error-404.jpg', props.image))
const primary404 = computed(() => forVariant('404', 'Go home', props.primaryLabel))
const secondary404 = computed(() => forVariant('404', 'Search docs', props.secondaryLabel))

const title500 = computed(() => forVariant('500', 'Internal server error', props.title))
const desc500 = computed(() =>
  forVariant(
    '500',
    'Something went wrong on our end. The team has been notified — try again in a moment.',
    props.description,
  ),
)
const code500 = computed(() => forVariant('500', '500', props.code))
const image500 = computed(() => forVariant('500', '/illustrations/error-500.jpg', props.image))
const primary500 = computed(() => forVariant('500', 'Retry', props.primaryLabel))
const secondary500 = computed(() => forVariant('500', 'Status page', props.secondaryLabel))

const title403 = computed(() => forVariant('403', 'Access denied', props.title))
const desc403 = computed(() =>
  forVariant(
    '403',
    "You don't have permission to view this page. Switch accounts or ask an admin to request access.",
    props.description,
  ),
)
const code403 = computed(() => forVariant('403', '403', props.code))
const image403 = computed(() => forVariant('403', '/illustrations/error-403.jpg', props.image))
const primary403 = computed(() => forVariant('403', 'Request access', props.primaryLabel))
const secondary403 = computed(() => forVariant('403', 'Switch account', props.secondaryLabel))

const title503 = computed(() => forVariant('maintenance', 'Scheduled maintenance', props.title))
const desc503 = computed(() =>
  forVariant('maintenance', "We're upgrading our systems. The service will be back online shortly.", props.description),
)
const code503 = computed(() => forVariant('maintenance', '503', props.code))
const image503 = computed(() => forVariant('maintenance', '/illustrations/error-maintenance.jpg', props.image))
const tag503 = computed(() => forVariant('maintenance', 'Back online around 14:00 UTC', props.tag))
const primary503 = computed(() => forVariant('maintenance', 'Subscribe for updates', props.primaryLabel))
const secondary503 = computed(() =>
  props.variant === 'maintenance' ? (props.secondaryLabel ?? '') : (props.secondaryLabel ?? ''),
)

const frameClass = computed(() =>
  cn('border-border bg-card overflow-hidden rounded-xl border text-left', props.size === 'sm' && 'rounded-lg'),
)
const imgClass = 'aspect-[16/10] w-full object-cover'
const panelClass = 'border-border bg-muted/40 border-b font-mono'
const bodyClass = computed(() => (props.size === 'sm' ? 'p-5' : 'p-6'))
const codeClass = computed(() => cn('font-semibold tracking-tighter', props.size === 'sm' ? 'text-2xl' : 'text-4xl'))
const titleClass = computed(() =>
  cn('mt-1.5 font-semibold tracking-tight', props.size === 'sm' ? 'text-base' : 'text-xl'),
)
const descClass = 'text-muted-foreground mt-2 max-w-sm text-sm'
const actionsClass = computed(() => cn('flex flex-wrap items-center gap-2', props.size === 'sm' ? 'mt-4' : 'mt-5'))
const actionSize = computed(() => (props.size === 'sm' ? 'xs' : 'sm'))
</script>

<template>
  <div
    data-slot="error-pages"
    :data-size="size"
    :class="cn(variant === 'all' && 'grid gap-4 sm:grid-cols-2', props.class)"
  >
    <article v-if="show('404')" :class="frameClass" data-slot="error-page" data-variant="404" role="status">
      <img v-if="image404" :src="image404" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="image404 === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /pricing/teams</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span> {{ code404 || '404' }} Not Found</p>
          <p class="text-muted-foreground">x-request-id: req_9k2e18</p>
        </div>
      </div>
      <div :class="bodyClass">
        <p v-if="code404" :class="codeClass">{{ code404 }}</p>
        <h3 :class="titleClass">{{ title404 }}</h3>
        <p :class="descClass">{{ desc404 }}</p>
        <p
          v-if="props.variant === '404' && props.tag"
          class="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs"
        >
          {{ props.tag }}
        </p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onHome?.()"
          >
            {{ primary404 }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSearch?.()"
          >
            {{ secondary404 }}
          </Button>
        </div>
      </div>
    </article>

    <article v-if="show('500')" :class="frameClass" data-slot="error-page" data-variant="500" role="alert">
      <img v-if="image500" :src="image500" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="image500 === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">POST /api/v1/invoices</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-destructive">{{ code500 || '500' }} Internal Server Error</span>
          </p>
          <p class="text-muted-foreground">error: ECONNRESET at Worker.run:142</p>
        </div>
      </div>
      <div :class="bodyClass">
        <p v-if="code500" :class="codeClass">{{ code500 }}</p>
        <h3 :class="titleClass">{{ title500 }}</h3>
        <p :class="descClass">{{ desc500 }}</p>
        <p
          v-if="props.variant === '500' && props.tag"
          class="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs"
        >
          {{ props.tag }}
        </p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onRetry?.()"
          >
            <RotateCcw />
            {{ primary500 }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="outline"
            :disabled="secondaryDisabled"
            @click="onStatus?.()"
          >
            {{ secondary500 }}
          </Button>
        </div>
      </div>
    </article>

    <article v-if="show('403')" :class="frameClass" data-slot="error-page" data-variant="403" role="alert">
      <img v-if="image403" :src="image403" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="image403 === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /admin/billing</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-warning">{{ code403 || '403' }} Forbidden</span>
          </p>
          <p class="text-muted-foreground">scope billing:read — denied for guest</p>
        </div>
      </div>
      <div :class="bodyClass">
        <p v-if="code403" :class="codeClass">{{ code403 }}</p>
        <h3 :class="titleClass">{{ title403 }}</h3>
        <p :class="descClass">{{ desc403 }}</p>
        <p
          v-if="props.variant === '403' && props.tag"
          class="text-muted-foreground mt-3 inline-flex items-center rounded-full border px-3 py-1 text-xs"
        >
          {{ props.tag }}
        </p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="outline"
            :disabled="secondaryDisabled"
            @click="onSwitchAccount?.()"
          >
            {{ secondary403 }}
          </Button>
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onRequestAccess?.()"
          >
            {{ primary403 }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('maintenance')"
      :class="frameClass"
      data-slot="error-page"
      data-variant="maintenance"
      role="status"
    >
      <img v-if="image503" :src="image503" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="image503 === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /health</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-warning">{{ code503 || '503' }} Service Unavailable</span>
          </p>
          <p class="text-muted-foreground">Retry-After: 3600</p>
        </div>
      </div>
      <div :class="bodyClass">
        <p v-if="code503" :class="codeClass">{{ code503 }}</p>
        <h3 :class="titleClass">{{ title503 }}</h3>
        <p :class="descClass">{{ desc503 }}</p>
        <p
          v-if="tag503"
          class="text-muted-foreground mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
        >
          <Clock class="size-3.5" aria-hidden="true" />
          {{ tag503 }}
        </p>
        <div v-if="showPrimary || (showSecondary && secondary503)" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="primaryDisabled"
            @click="onSubscribe?.()"
          >
            {{ primary503 }}
          </Button>
          <Button
            v-if="showSecondary && secondary503"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="outline"
            :disabled="secondaryDisabled"
            @click="onStatus?.()"
          >
            {{ secondary503 }}
          </Button>
        </div>
      </div>
    </article>
  </div>
</template>
