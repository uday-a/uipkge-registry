<script lang="ts">
  import { Input, InputGroup, InputGroupAddon, InputGroupButton } from '@svelte-registry/input'
  import { Label } from '@svelte-registry/label'
  import { AtSign, Mail, Search } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let name = $state('')
  let clearable = $state('Clear me')
  let counted = $state('')
</script>

{#if story === 'Default'}
  <div class="grid max-w-sm gap-2">
    <Label for="svelte-input-name">Name</Label>
    <Input id="svelte-input-name" bind:value={name} placeholder="Jane Doe" />
    <p class="text-muted-foreground text-xs">Typed: {name || '—'}</p>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="grid max-w-sm gap-3">
    <Input size="small" placeholder="Small" />
    <Input placeholder="Middle (default)" />
    <Input size="large" placeholder="Large" />
  </div>
{/if}

{#if story === 'Variants'}
  <div class="grid max-w-sm gap-3">
    <Input placeholder="Outlined (default)" />
    <Input variant="filled" placeholder="Filled" />
    <Input variant="borderless" placeholder="Borderless" />
  </div>
{/if}

{#if story === 'Status'}
  <div class="grid max-w-sm gap-3">
    <Input status="error" defaultValue="not-an-email" />
    <Input status="warning" defaultValue="Unverified domain" />
  </div>
{/if}

{#if story === 'Prefix & Suffix'}
  <div class="grid max-w-sm gap-3">
    <Input prefixIcon={Mail} placeholder="you@acme.com" />
    <Input suffixIcon={Search} placeholder="Search…" />
    <Input prefix="$" suffix="USD" placeholder="0.00" />
    <Input prefixIcon={AtSign} placeholder="username" />
  </div>
{/if}

{#if story === 'Addon before & after'}
  <div class="grid max-w-md gap-3">
    <Input addonBefore="https://" placeholder="example.com" />
    <Input addonAfter=".com" placeholder="mysite" />
  </div>
{/if}

{#if story === 'Allow clear'}
  <div class="grid max-w-sm gap-2">
    <Input bind:value={clearable} allowClear placeholder="Hover or focus to reveal ✕" />
  </div>
{/if}

{#if story === 'Show count'}
  <div class="grid max-w-sm gap-2">
    <Input bind:value={counted} showCount maxlength={24} placeholder="Max 24 characters" />
  </div>
{/if}

{#if story === 'Password toggle'}
  <div class="grid max-w-sm gap-2">
    <Input type="password" showPasswordToggle defaultValue="hunter2" />
  </div>
{/if}

{#if story === 'Disabled & Readonly'}
  <div class="grid max-w-sm gap-3">
    <Input disabled defaultValue="Disabled input" />
    <Input readonly defaultValue="Readonly input" />
  </div>
{/if}

{#if story === 'Input group'}
  <div class="grid max-w-md gap-3">
    <InputGroup>
      <InputGroupAddon>
        <Search class="size-4" />
      </InputGroupAddon>
      <input placeholder="Search issues…" />
      <InputGroupButton>⌘K</InputGroupButton>
    </InputGroup>
    <InputGroup>
      <InputGroupAddon>https://</InputGroupAddon>
      <input placeholder="example.com" />
      <InputGroupButton variant="secondary">Visit</InputGroupButton>
    </InputGroup>
  </div>
{/if}
