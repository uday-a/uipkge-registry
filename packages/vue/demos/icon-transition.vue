<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { IconTransition } from '@/components/ui/icon-transition'
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Heart,
  Link2,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  UserPlus,
  UserCheck,
} from 'lucide-vue-next'

const sampleUrl = 'https://uipkge.dev/r/vue/button.json'
async function copySample() {
  try {
    await navigator.clipboard?.writeText(sampleUrl)
    return true
  } catch {
    return false
  }
}

const liked = ref(false)
const bookmarkRef = ref<{ trigger: () => void; reset: () => void } | null>(null)
</script>

<template>
  <Story
    title="Default — copy command"
    description="Standard copy button. Click runs the async action; on success the icon springs into the Check, then auto-reverts after 1.5s."
  >
    <div class="bg-muted/30 border-border flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm">
      <code class="min-w-0 flex-1 truncate">{{ sampleUrl }}</code>
      <IconTransition
        :default-icon="Copy"
        :active-icon="Check"
        icon-class="size-4"
        label="Copy URL"
        active-label="Copied"
        class="text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-md"
        :action="copySample"
      />
    </div>
  </Story>

  <Story
    title="Externally controlled — like button"
    description="Pass `:active` to drive the icon swap from your own state, instead of using the built-in click handler. Useful when the parent already manages the toggle."
  >
    <Button variant="outline" :class="liked ? 'text-rose-500' : ''" @click="liked = !liked">
      <IconTransition
        as="span"
        :default-icon="Heart"
        :active-icon="Heart"
        :active="liked"
        active-class="text-rose-500 fill-current"
        icon-class="size-4"
        class="size-4"
      />
      {{ liked ? 'Liked' : 'Like' }}
    </Button>
  </Story>

  <Story
    title="Stay active — bookmark with manual reset"
    description='Pass `:resetAfter="0"` to keep the active icon. Reset programmatically by calling the exposed `reset()` method via a template ref.'
  >
    <div class="flex items-center gap-3">
      <IconTransition
        ref="bookmarkRef"
        :default-icon="Bookmark"
        :active-icon="BookmarkCheck"
        :reset-after="0"
        icon-class="size-5"
        label="Save"
        active-label="Saved"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
      <Button variant="ghost" size="sm" @click="bookmarkRef?.reset()">Reset</Button>
    </div>
  </Story>

  <Story
    title="Different icons per role"
    description="The active icon does not have to be a Check — any pair of icons works. Here are share/follow/star patterns built on the same primitive."
  >
    <div class="flex flex-wrap gap-2">
      <IconTransition
        :default-icon="Share2"
        :active-icon="Check"
        icon-class="size-4"
        label="Share"
        active-label="Shared"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
      <IconTransition
        :default-icon="UserPlus"
        :active-icon="UserCheck"
        icon-class="size-4"
        label="Follow"
        active-label="Following"
        active-class="text-info"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
      <IconTransition
        :default-icon="Star"
        :active-icon="Star"
        icon-class="size-4"
        label="Star"
        active-label="Starred"
        active-class="text-amber-500 fill-current"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
      <IconTransition
        :default-icon="ThumbsUp"
        :active-icon="ThumbsUp"
        icon-class="size-4"
        label="Upvote"
        active-label="Upvoted"
        active-class="text-emerald-500 fill-current"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
      <IconTransition
        :default-icon="Plus"
        :active-icon="Check"
        icon-class="size-4"
        label="Add"
        active-label="Added"
        class="border-border hover:bg-muted size-9 rounded-md border"
      />
    </div>
  </Story>

  <Story
    title="Inline inside a chip"
    description='Use `as="span"` and `:active` to make the icon a passive child of an outer button. The chip handles the click and tracks state — the icon just animates.'
  >
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="name in ['button', 'data-table', 'dialog', 'sonner']"
        :key="name"
        type="button"
        class="group bg-muted/30 border-border hover:border-primary/40 focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
        @click="copySample"
      >
        <span class="text-muted-foreground font-sans tracking-wider uppercase">add</span>
        <span>{{ name }}</span>
        <IconTransition
          as="span"
          :default-icon="Link2"
          :active-icon="Check"
          icon-class="size-3"
          class="text-muted-foreground size-3"
        />
      </button>
    </div>
    <p class="text-muted-foreground mt-2 text-xs">
      Each chip is its own button; the IconTransition lives inside in `as=&quot;span&quot;` mode and never receives
      clicks directly.
    </p>
  </Story>
</template>
