<script lang="ts">
  import { Input } from '@svelte-registry/input'
  import { Label } from '@svelte-registry/label'

  let { story }: { story: string } = $props()
</script>

{#if story === 'With input'}
  <div class="grid max-w-sm gap-2">
    <Label for="name">Name</Label>
    <Input id="name" placeholder="Jane Doe" />
  </div>
{/if}

{#if story === 'Required and invalid'}
  <div class="grid max-w-sm gap-2">
    <Label for="email" class="text-destructive">Email <span aria-hidden="true">*</span></Label>
    <Input id="email" type="email" aria-invalid="true" />
    <p class="text-destructive text-xs">Required field</p>
  </div>
{/if}

{#if story === 'Inline with checkbox'}
  <div class="flex max-w-sm items-center gap-2">
    <input id="agree" type="checkbox" class="accent-primary size-4" />
    <Label for="agree" class="text-muted-foreground">Inline label next to checkbox</Label>
  </div>
{/if}
