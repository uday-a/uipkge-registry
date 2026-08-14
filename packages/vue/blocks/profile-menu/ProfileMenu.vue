<script setup lang="ts">
import { computed } from 'vue'
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles, Settings } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface User {
  name: string
  email: string
  avatar?: string
}

const props = withDefaults(
  defineProps<{
    user?: User
  }>(),
  {
    user: () => ({ name: 'Alex Morgan', email: 'alex@example.com', avatar: '' }),
  },
)

const emit = defineEmits<{
  (e: 'select', key: 'upgrade' | 'account' | 'billing' | 'notifications' | 'settings' | 'logout'): void
}>()

const initials = computed(() => {
  const parts = props.user.name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase()).join('') || 'U'
})
</script>

<template>
  <DropdownMenu data-slot="profile-menu">
    <DropdownMenuTrigger as-child>
      <slot :user="user" :initials="initials">
        <button
          type="button"
          class="hover:bg-accent focus-visible:ring-ring flex size-8 items-center justify-center rounded-lg transition-colors focus-visible:ring-1 focus-visible:outline-none"
          aria-label="Open profile menu"
        >
          <Avatar class="size-7">
            <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
            <AvatarFallback class="bg-primary/10 text-primary text-xs font-semibold">
              {{ initials }}
            </AvatarFallback>
          </Avatar>
        </button>
      </slot>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-60 rounded-lg" align="end" :side-offset="8">
      <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar class="size-9 rounded-lg">
            <AvatarImage v-if="user.avatar" :src="user.avatar" :alt="user.name" />
            <AvatarFallback class="bg-primary/10 text-primary rounded-lg text-xs font-semibold">
              {{ initials }}
            </AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left leading-tight">
            <span class="truncate text-sm font-semibold">{{ user.name }}</span>
            <span class="text-muted-foreground truncate text-xs">{{ user.email }}</span>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @select="emit('select', 'upgrade')">
          <Sparkles class="size-4" />
          Upgrade to Pro
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @select="emit('select', 'account')">
          <BadgeCheck class="size-4" />
          Account
        </DropdownMenuItem>
        <DropdownMenuItem @select="emit('select', 'billing')">
          <CreditCard class="size-4" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem @select="emit('select', 'notifications')">
          <Bell class="size-4" />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuItem @select="emit('select', 'settings')">
          <Settings class="size-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @select="emit('select', 'logout')">
        <LogOut class="size-4" />
        Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
