<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type EmptyStateVariant =
  | 'no-data'
  | 'no-search-results'
  | 'first-use'
  | 'error-recovery'
  | 'no-access'
  | 'sync-complete'

interface Props {
  /** `'all'` renders the full gallery; a single variant renders just that card. */
  variant?: EmptyStateVariant | 'all'
  size?: 'sm' | 'default'
  layout?: 'grid' | 'list'
  class?: HTMLAttributes['class']
  title?: string
  description?: string
  /** Replaces the response panel on a single variant. Pass `''` to hide art. */
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
}

export type EmptyStatesProps = Props

const props = withDefaults(defineProps<Props>(), {
  variant: 'all',
  size: 'default',
  layout: 'grid',
  imageAlt: '',
  showPrimary: true,
  showSecondary: true,
  primaryDisabled: false,
  secondaryDisabled: false,
})

const show = (v: EmptyStateVariant) => props.variant === 'all' || props.variant === v
const copy = (fallback: string, override?: string) => (override === undefined ? fallback : override)
const forVariant = (v: EmptyStateVariant, fallback: string, override?: string) =>
  props.variant === v ? copy(fallback, override) : fallback

const titleNoData = computed(() => forVariant('no-data', 'Nothing here yet', props.title))
const descNoData = computed(() =>
  forVariant(
    'no-data',
    'Your workspace is empty. Create your first project or import existing data to get started.',
    props.description,
  ),
)
const imageNoData = computed(() => forVariant('no-data', '/illustrations/empty-no-data.jpg', props.image))
const primaryNoData = computed(() => forVariant('no-data', 'Create', props.primaryLabel))
const secondaryNoData = computed(() => forVariant('no-data', 'Import data', props.secondaryLabel))

const titleSearch = computed(() => forVariant('no-search-results', 'No matches', props.title))
const descSearch = computed(() =>
  forVariant(
    'no-search-results',
    'Nothing matched your current filters. Try different keywords or broaden the search.',
    props.description,
  ),
)
const imageSearch = computed(() => forVariant('no-search-results', '/illustrations/empty-no-search.jpg', props.image))
const primarySearch = computed(() => forVariant('no-search-results', 'Clear filters', props.primaryLabel))
const secondarySearch = computed(() => forVariant('no-search-results', 'View all', props.secondaryLabel))

const titleFirst = computed(() => forVariant('first-use', 'Welcome to Acme', props.title))
const descFirst = computed(() =>
  forVariant(
    'first-use',
    'This is your new dashboard. Set up your workspace and invite the team to start collaborating.',
    props.description,
  ),
)
const imageFirst = computed(() => forVariant('first-use', '/illustrations/empty-first-use.jpg', props.image))
const primaryFirst = computed(() => forVariant('first-use', 'Get started', props.primaryLabel))
const secondaryFirst = computed(() => forVariant('first-use', 'Take a tour', props.secondaryLabel))

const titleError = computed(() => forVariant('error-recovery', 'Something broke', props.title))
const descError = computed(() =>
  forVariant(
    'error-recovery',
    "We couldn't load your data. Your work is safe — check the connection and try again.",
    props.description,
  ),
)
const imageError = computed(() => forVariant('error-recovery', '/illustrations/empty-error-recovery.jpg', props.image))
const primaryError = computed(() => forVariant('error-recovery', 'Retry', props.primaryLabel))
const secondaryError = computed(() => forVariant('error-recovery', 'Contact support', props.secondaryLabel))

const titleAccess = computed(() => forVariant('no-access', 'Ask your admin', props.title))
const descAccess = computed(() =>
  forVariant(
    'no-access',
    "You don't have access to this workspace yet. Request permission and we'll notify you once it's granted.",
    props.description,
  ),
)
const imageAccess = computed(() => forVariant('no-access', '/illustrations/empty-no-access.jpg', props.image))
const primaryAccess = computed(() => forVariant('no-access', 'Request access', props.primaryLabel))
const secondaryAccess = computed(() => forVariant('no-access', 'Switch account', props.secondaryLabel))

const titleSync = computed(() => forVariant('sync-complete', 'Everything synced', props.title))
const descSync = computed(() =>
  forVariant(
    'sync-complete',
    'All changes were uploaded a few seconds ago. We will keep syncing in the background.',
    props.description,
  ),
)
const imageSync = computed(() => forVariant('sync-complete', '/illustrations/empty-sync-complete.jpg', props.image))
const secondarySync = computed(() => forVariant('sync-complete', 'View activity', props.secondaryLabel))

const cardClass = computed(() =>
  cn(
    'border-border bg-card overflow-hidden rounded-xl border text-left',
    props.size === 'sm' && 'rounded-lg',
    props.layout === 'list' && 'w-full max-w-md',
  ),
)
const imgClass = computed(() => cn('w-full object-cover', props.size === 'sm' ? 'aspect-[16/9]' : 'aspect-[16/10]'))
const panelClass = 'border-border bg-muted/40 border-b font-mono'
const bodyClass = computed(() => (props.size === 'sm' ? 'p-5' : 'p-6'))
const titleClass = 'text-sm font-medium'
const descClass = 'text-muted-foreground mt-1 max-w-xs text-sm'
const actionsClass = computed(() => cn('flex flex-wrap items-center gap-2', props.size === 'sm' ? 'mt-4' : 'mt-5'))
const actionSize = computed(() => (props.size === 'sm' ? 'xs' : 'sm'))
</script>

<template>
  <div
    data-slot="empty-states"
    :data-layout="layout"
    :class="
      cn(
        layout === 'list' ? 'flex flex-col items-center gap-4' : 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3',
        props.class,
      )
    "
  >
    <article
      v-if="show('no-data')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="no-data"
      role="status"
    >
      <img v-if="imageNoData" :src="imageNoData" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageNoData === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /v1/projects</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span> 200 OK</p>
          <p class="text-muted-foreground">{ "data": [], "total": 0 }</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleNoData }}</h3>
        <p :class="descClass">{{ descNoData }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            {{ primaryNoData }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondaryNoData }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('no-search-results')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="no-search-results"
      role="status"
    >
      <img v-if="imageSearch" :src="imageSearch" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageSearch === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">
          GET /search?q=northwind
        </div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span> 200 OK</p>
          <p class="text-muted-foreground">{ "hits": 0 }</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleSearch }}</h3>
        <p :class="descClass">{{ descSearch }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            {{ primarySearch }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondarySearch }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('first-use')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="first-use"
      role="status"
    >
      <img v-if="imageFirst" :src="imageFirst" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageFirst === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /v1/workspace</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span> 200 OK</p>
          <p class="text-muted-foreground">{ "onboarded": false }</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleFirst }}</h3>
        <p :class="descClass">{{ descFirst }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            {{ primaryFirst }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondaryFirst }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('error-recovery')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="error-recovery"
      role="alert"
    >
      <img v-if="imageError" :src="imageError" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageError === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /api/projects</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-destructive">500 Internal Server Error</span>
          </p>
          <p class="text-muted-foreground">error: upstream_timeout</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleError }}</h3>
        <p :class="descClass">{{ descError }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            <RotateCcw />
            {{ primaryError }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondaryError }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('no-access')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="no-access"
      role="status"
    >
      <img v-if="imageAccess" :src="imageAccess" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageAccess === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">GET /settings/billing</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p>
            <span class="text-muted-foreground">HTTP/1.1</span>{{ ' ' }}
            <span class="text-warning">403 Forbidden</span>
          </p>
          <p class="text-muted-foreground">scope billing:read — missing</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleAccess }}</h3>
        <p :class="descClass">{{ descAccess }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showPrimary"
            :as="primaryHref ? 'a' : 'button'"
            :href="primaryHref"
            :size="actionSize"
            :disabled="primaryDisabled"
            @click="onPrimary?.()"
          >
            {{ primaryAccess }}
          </Button>
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondaryAccess }}
          </Button>
        </div>
      </div>
    </article>

    <article
      v-if="show('sync-complete')"
      :class="cardClass"
      data-slot="empty-states-card"
      data-variant="sync-complete"
      role="status"
    >
      <img v-if="imageSync" :src="imageSync" :alt="imageAlt" :class="imgClass" />
      <div v-else-if="imageSync === undefined" :class="panelClass" aria-hidden="true">
        <div class="border-border text-muted-foreground truncate border-b px-3 py-2 text-xs">POST /sync</div>
        <div class="space-y-1 p-3 text-xs leading-relaxed">
          <p><span class="text-muted-foreground">HTTP/1.1</span> 200 OK</p>
          <p class="text-muted-foreground">{ "synced": 128, "lag_ms": 40 }</p>
        </div>
      </div>
      <div :class="bodyClass">
        <h3 :class="titleClass">{{ titleSync }}</h3>
        <p :class="descClass">{{ descSync }}</p>
        <div v-if="showPrimary || showSecondary" :class="actionsClass">
          <Button
            v-if="showSecondary"
            :as="secondaryHref ? 'a' : 'button'"
            :href="secondaryHref"
            :size="actionSize"
            variant="ghost"
            :disabled="secondaryDisabled"
            @click="onSecondary?.()"
          >
            {{ secondarySync }}
          </Button>
        </div>
      </div>
    </article>
  </div>
</template>
