<script setup lang="ts">
import { Mentions } from '@/components/ui/mentions'
import { computed, ref } from 'vue'
import type { MentionOption } from '@/components/ui/mentions'

interface User extends MentionOption {
  description?: string
  avatar?: string
}

const text1 = ref('Hey ')
const text2 = ref('Hey ')
const text3 = ref('Type @ for users or # for channels: ')
const text4 = ref('')

const users: User[] = [
  { value: 'ada', label: 'Ada Lovelace', description: 'Engineering' },
  { value: 'grace', label: 'Grace Hopper', description: 'Engineering' },
  { value: 'tim', label: 'Tim Berners-Lee', description: 'Web' },
  { value: 'linus', label: 'Linus Torvalds', description: 'Kernel' },
  { value: 'guido', label: 'Guido van Rossum', description: 'Python' },
  { value: 'matz', label: 'Yukihiro Matsumoto', description: 'Ruby' },
]

const channels: MentionOption[] = [
  { value: 'general', label: '#general' },
  { value: 'random', label: '#random' },
  { value: 'eng-frontend', label: '#eng-frontend' },
  { value: 'eng-backend', label: '#eng-backend' },
]

const options3 = computed<MentionOption[]>(() => (/[#]\w*$/.test(text3.value) ? channels : users))

function loadUsers(q: string): Promise<User[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ql = q.toLowerCase()
      resolve(users.filter((u) => u.label.toLowerCase().includes(ql) || u.value.toLowerCase().includes(ql)))
    }, 400)
  })
}

const usersWithAvatars = computed<User[]>(() =>
  users.map((u) => ({ ...u, avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=' + u.value })),
)
</script>

<template>
  <Story title="Static options" description="Type @ to filter users.">
    <div class="space-y-2">
      <Mentions v-model="text1" :options="users" placeholder="Type @ to mention..." />
      <pre class="text-muted-foreground text-xs">{{ text1 }}</pre>
    </div>
  </Story>

  <Story title="Async options" description="loadOptions returns a promise. Debounced 200ms.">
    <div class="space-y-2">
      <Mentions v-model="text2" :load-options="loadUsers" placeholder="Type @ for async users..." />
      <pre class="text-muted-foreground text-xs">{{ text2 }}</pre>
    </div>
  </Story>

  <Story
    title="Multiple triggers"
    description="Pass an array of triggers - each opens the popup. Format function uses the active trigger."
  >
    <div class="space-y-2">
      <Mentions
        v-model="text3"
        :triggers="['@', '#']"
        :options="options3"
        :format="(opt: MentionOption, trigger: string) => trigger + opt.value + ' '"
        placeholder="@ for users, # for channels"
      />
      <pre class="text-muted-foreground text-xs">{{ text3 }}</pre>
    </div>
  </Story>

  <Story title="Custom row content" description="Options with avatar + description render in two lines.">
    <div class="space-y-2">
      <Mentions v-model="text4" :options="usersWithAvatars" placeholder="Type @ to see avatars..." />
      <pre class="text-muted-foreground text-xs">{{ text4 }}</pre>
    </div>
  </Story>
</template>
