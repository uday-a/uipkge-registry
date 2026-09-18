<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref } from 'vue'
import { Calendar, Check, ExternalLink } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface Props {
  trigger?: string
  name?: string
  handle?: string
  email?: string
  avatar?: string
  bio?: string
  joined?: string
  location?: string
  following?: number | string
  followers?: number | string
  verified?: boolean
  href?: string
  popover?: boolean
  openDelay?: number
  closeDelay?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  trigger: '@',
  popover: true,
  openDelay: 150,
  closeDelay: 100,
})

const isFollowing = ref(false)

const formattedHandle = computed(() => {
  if (!props.handle && !props.name) return ''
  const h = props.handle || props.name || ''
  return h.startsWith(props.trigger) ? h : `${props.trigger}${h}`
})

const initials = computed(() => {
  const source = props.name || props.handle || 'U'
  return source.slice(0, 2).toUpperCase()
})
</script>

<template>
  <HoverCard v-if="popover" :open-delay="openDelay" :close-delay="closeDelay">
    <HoverCardTrigger as-child>
      <component
        :is="href ? 'a' : 'span'"
        :href="href"
        data-uipkge
        data-slot="mention-tag"
        :class="
          cn(
            'inline-flex cursor-pointer items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors select-none',
            'bg-muted/70 text-foreground hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
            props.class,
          )
        "
      >
        <slot>
          <span class="text-primary font-semibold">{{ trigger }}</span>
          <span>{{ name || handle || email }}</span>
        </slot>
      </component>
    </HoverCardTrigger>

    <HoverCardContent align="start" :side-offset="6" class="border-border/80 w-80 rounded-xl p-4 shadow-lg">
      <slot name="popup">
        <!-- Twitter/X style profile popup -->
        <div class="space-y-3">
          <div class="flex items-start justify-between gap-3">
            <Avatar class="ring-border/50 size-12 ring-2">
              <AvatarImage v-if="avatar" :src="avatar" :alt="name || handle" />
              <AvatarFallback class="text-sm font-semibold">{{ initials }}</AvatarFallback>
            </Avatar>
            <button
              type="button"
              :class="
                cn(
                  'h-8 rounded-full px-3.5 text-xs font-semibold transition-[transform,background-color] duration-150 active:scale-95',
                  isFollowing
                    ? 'border-border text-foreground hover:bg-muted border bg-transparent'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs',
                )
              "
              @click.stop="isFollowing = !isFollowing"
            >
              {{ isFollowing ? 'Following' : 'Follow' }}
            </button>
          </div>

          <div>
            <div class="flex items-center gap-1">
              <span class="text-foreground text-sm font-bold tracking-tight">{{ name || handle }}</span>
              <span v-if="verified" class="text-primary inline-flex" title="Verified">
                <svg class="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
              </span>
            </div>
            <p class="text-muted-foreground font-mono text-xs">{{ formattedHandle }}</p>
            <p v-if="email" class="text-muted-foreground mt-0.5 text-xs">{{ email }}</p>
          </div>

          <p v-if="bio" class="text-foreground/90 text-xs leading-relaxed">{{ bio }}</p>

          <div v-if="joined || location" class="text-muted-foreground flex items-center gap-4 text-xs">
            <div v-if="joined" class="flex items-center gap-1">
              <Calendar class="size-3.5 opacity-70" />
              <span>Joined {{ joined }}</span>
            </div>
          </div>

          <div
            v-if="following !== undefined || followers !== undefined"
            class="border-border/50 flex items-center gap-4 border-t pt-1 text-xs"
          >
            <div v-if="following !== undefined">
              <span class="text-foreground font-bold">{{ following }}</span>
              <span class="text-muted-foreground ml-1">Following</span>
            </div>
            <div v-if="followers !== undefined">
              <span class="text-foreground font-bold">{{ followers }}</span>
              <span class="text-muted-foreground ml-1">Followers</span>
            </div>
          </div>
        </div>
      </slot>
    </HoverCardContent>
  </HoverCard>

  <!-- Non-popover fallback -->
  <component
    :is="href ? 'a' : 'span'"
    v-else
    :href="href"
    data-uipkge
    data-slot="mention-tag"
    :class="
      cn(
        'inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-sm font-medium transition-colors',
        'bg-muted/70 text-foreground',
        props.class,
      )
    "
  >
    <slot>
      <span class="text-primary font-semibold">{{ trigger }}</span>
      <span>{{ name || handle || email }}</span>
    </slot>
  </component>
</template>
