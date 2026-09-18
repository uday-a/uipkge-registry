<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mentions, MentionTag, type MentionOption } from '@/components/ui/mentions'

interface User extends MentionOption {
  description?: string
  avatar?: string
}

const text1 = ref('Hey @ada, check out the new design system update!')
const text2 = ref('Hey ')
const text3 = ref('Drafting notes with @sarah and #v2-launch tracking $NVDA ')
const text4 = ref('')

const users: User[] = [
  {
    value: 'ada',
    label: 'Ada Lovelace',
    handle: 'adalovelace',
    email: 'ada@computing.org',
    description: 'First Computer Programmer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Mathematician and writer, chiefly known for work on Babbage’s mechanical general-purpose computer.',
    joined: 'March 2021',
    following: 128,
    followers: '42.5K',
    verified: true,
  },
  {
    value: 'grace',
    label: 'Grace Hopper',
    handle: 'ghopper',
    email: 'grace@navy.mil',
    description: 'Compilers & Systems Pioneer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Computer scientist and United States Navy rear admiral. Pioneer of compiler construction.',
    joined: 'January 2022',
    following: 256,
    followers: '94.1K',
    verified: true,
  },
  {
    value: 'linus',
    label: 'Linus Torvalds',
    handle: 'torvalds',
    email: 'linus@kernel.org',
    description: 'Linux & Git Creator',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Creator of the Linux kernel and the Git version control system. Still hacking on kernel trees.',
    joined: 'September 2020',
    following: 12,
    followers: '180K',
    verified: true,
  },
]

const multiTriggerOptions: Record<string, MentionOption[]> = {
  '@': [
    { value: 'sarah', label: 'Sarah Connor', description: 'Tech Lead · SecOps' },
    { value: 'marcus', label: 'Marcus Vance', description: 'Staff Engineer' },
    { value: 'priya', label: 'Priya Nair', description: 'Design Systems' },
  ],
  '#': [
    { value: 'v2-launch', label: 'v2-launch', description: 'Next major release milestone' },
    { value: 'performance', label: 'performance', description: 'Core Web Vitals & bundle optimization' },
    { value: 'tokens', label: 'tokens', description: 'OKLCH color system adjustments' },
  ],
  $: [
    { value: 'AAPL', label: 'Apple Inc.', description: 'AAPL · NASDAQ · $224.23' },
    { value: 'NVDA', label: 'Nvidia Corp.', description: 'NVDA · NASDAQ · $118.50' },
    { value: 'TSLA', label: 'Tesla Inc.', description: 'TSLA · NASDAQ · $242.10' },
  ],
}

function loadUsers(q: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ql = q.toLowerCase()
      resolve(users.filter((u) => u.label.toLowerCase().includes(ql) || u.value.toLowerCase().includes(ql)))
    }, 300)
  })
}

const usersWithAvatars = computed<User[]>(() =>
  users.map((u) => ({ ...u, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + u.value })),
)
</script>

<template>
  <Story
    title="Twitter / X-Style Profile Hover Popup"
    description="Hover over mention tokens to reveal an animated Twitter/X-style profile preview card with avatar, verified badge, bio, following stats, and tactile follow button."
  >
    <div class="max-w-xl space-y-4">
      <div class="border-border bg-card space-y-3 rounded-xl border p-4 shadow-xs">
        <p class="text-foreground text-sm leading-relaxed">
          Great work on the compiler release! Big thanks to
          <MentionTag
            name="Ada Lovelace"
            handle="adalovelace"
            email="ada@computing.org"
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            bio="Mathematician and writer, chiefly known for work on Babbage’s mechanical general-purpose computer."
            joined="March 2021"
            following="128"
            followers="42.5K"
            verified
          />
          and
          <MentionTag
            name="Grace Hopper"
            handle="ghopper"
            email="grace@navy.mil"
            avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
            bio="Computer scientist and United States Navy rear admiral. Pioneer of compiler construction."
            joined="January 2022"
            following="256"
            followers="94.1K"
            verified
          />
          for their architectural guidance on the new AST pipeline.
        </p>
        <div class="border-border/50 text-muted-foreground flex items-center gap-2 border-t pt-2 text-xs">
          <span>Tags:</span>
          <MentionTag
            trigger="#"
            name="v2-launch"
            :popover="false"
            class="bg-primary/10 text-primary hover:bg-primary/20"
          />
          <MentionTag
            trigger="#"
            name="architecture"
            :popover="false"
            class="bg-primary/10 text-primary hover:bg-primary/20"
          />
        </div>
      </div>
    </div>
  </Story>

  <Story
    title="Multi-Trigger Autocomplete (@, #, $)"
    description="Type @ for users, # for issue/project tags, or $ for stock/token tickers with custom prefix mapping."
  >
    <div class="space-y-2">
      <Mentions
        v-model="text3"
        :triggers="['@', '#', '$']"
        :options="multiTriggerOptions"
        placeholder="Type @ for users, # for tags, $ for assets..."
      />
      <p class="text-muted-foreground font-mono text-xs">Value: {{ text3 }}</p>
    </div>
  </Story>

  <Story
    title="Static Options with Mentions Input"
    description="Type @ to filter users with instant keyboard navigation."
  >
    <div class="space-y-2">
      <Mentions v-model="text1" :options="users" placeholder="Type @ to mention..." />
      <pre class="text-muted-foreground text-xs">{{ text1 }}</pre>
    </div>
  </Story>

  <Story title="Async Debounced Options" description="loadOptions returns a promise debounced 200ms.">
    <div class="space-y-2">
      <Mentions v-model="text2" :load-options="loadUsers" placeholder="Type @ for async users..." />
      <pre class="text-muted-foreground text-xs">{{ text2 }}</pre>
    </div>
  </Story>

  <Story title="Custom Row Content" description="Options with avatar + description render in clean two-line layout.">
    <div class="space-y-2">
      <Mentions v-model="text4" :options="usersWithAvatars" placeholder="Type @ to see avatars..." />
      <pre class="text-muted-foreground text-xs">{{ text4 }}</pre>
    </div>
  </Story>
</template>
