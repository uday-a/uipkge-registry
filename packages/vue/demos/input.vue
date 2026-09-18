<script setup lang="ts">
// Astro's plain Vue has no Nuxt auto-import; pull reactivity APIs explicitly.
import { ref } from 'vue'
import { Search, Mail, DollarSign, Copy } from 'lucide-vue-next'
import { Input, InputGroup, InputGroupAddon, InputGroupButton } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const text = ref('')
const password = ref('secret123')
const email = ref('')
const searchText = ref('')
const username = ref('')
const amount = ref('')
const website = ref('')
const counted = ref('')
const clearable = ref('Clear me')
</script>

<template>
  <Story title="Default" description="Two-way bound with v-model. Plain text input with label.">
    <div class="grid max-w-sm gap-2">
      <Label for="email">Email</Label>
      <Input id="email" v-model="text" type="email" placeholder="you@example.com" />
      <p class="text-muted-foreground text-xs">
        Live: <code class="text-foreground">{{ text || '—' }}</code>
      </p>
    </div>
  </Story>

  <Story title="Sizes" description="Three heights: small, middle (default), and large.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="text" size="small" placeholder="Small input" />
      <Input v-model="text" size="middle" placeholder="Middle input" />
      <Input v-model="text" size="large" placeholder="Large input" />
    </div>
  </Story>

  <Story title="Variants" description="Outlined, filled, and borderless backgrounds.">
    <div class="grid max-w-sm gap-3">
      <Input placeholder="Outlined (default)" variant="outlined" />
      <Input placeholder="Filled" variant="filled" />
      <Input placeholder="Borderless" variant="borderless" />
    </div>
  </Story>

  <Story title="Status" description="Error and warning visual states via the status prop.">
    <div class="grid max-w-sm gap-3">
      <Input placeholder="Error state" status="error" />
      <Input placeholder="Warning state" status="warning" />
      <Input placeholder="Error with value" status="error" model-value="invalid" />
    </div>
  </Story>

  <Story title="Prefix & Suffix" description="String or slot content rendered inside the input wrapper.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="username" placeholder="Username" prefix="@" />
      <Input v-model="amount" placeholder="0.00" suffix="USD" />
      <Input v-model="searchText" placeholder="Search...">
        <template #prefix>
          <Search class="size-4" />
        </template>
      </Input>
      <Input v-model="email" placeholder="you@example.com">
        <template #suffix>
          <Mail class="size-4" />
        </template>
      </Input>
    </div>
  </Story>

  <Story title="Addon before & after" description="Input group styling with addon segments.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="website" placeholder="website" addon-before="https://" addon-after=".com" />
      <Input v-model="amount" placeholder="0.00">
        <template #addonBefore>
          <DollarSign class="size-4" />
        </template>
        <template #addonAfter>
          <span class="text-xs">USD</span>
        </template>
      </Input>
    </div>
  </Story>

  <Story title="Allow clear" description="Shows an X icon when the input has value and is focused or hovered.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="clearable" placeholder="Type something..." allow-clear />
    </div>
  </Story>

  <Story title="Show count" description="Displays character count when maxlength is set.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="counted" placeholder="Max 20 characters..." maxlength="20" show-count />
    </div>
  </Story>

  <Story title="Password toggle" description="Eye icon to toggle password visibility.">
    <div class="grid max-w-sm gap-3">
      <Input v-model="password" type="password" placeholder="Password" show-password-toggle />
      <Input v-model="password" type="password" placeholder="Large password" size="large" show-password-toggle />
    </div>
  </Story>

  <Story title="Disabled & Readonly" description="Non-interactive states with full styling.">
    <div class="grid max-w-sm gap-3">
      <Input placeholder="Disabled" disabled />
      <Input placeholder="Readonly" readonly model-value="Cannot edit" />
      <Input placeholder="Disabled with prefix" prefix="@" disabled />
    </div>
  </Story>

  <Story
    title="Composite Input Groups"
    description="Seamless input wrappers with prefix addons, copy buttons, and action triggers."
  >
    <div class="grid max-w-sm gap-3">
      <InputGroup>
        <InputGroupAddon>https://</InputGroupAddon>
        <Input placeholder="uipkge.dev" />
        <InputGroupButton variant="ghost">
          <Copy class="size-3.5" />
        </InputGroupButton>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon>
          <Search class="size-4" />
        </InputGroupAddon>
        <Input placeholder="Search packages..." />
        <InputGroupButton variant="default">Search</InputGroupButton>
      </InputGroup>
    </div>
  </Story>
</template>
