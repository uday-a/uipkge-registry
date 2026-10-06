<script lang="ts">
  import { Icon } from '@svelte-registry/icons'
  import { Home, Settings, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Sizes'}
  <div class="flex items-center gap-4">
    <Icon size="xs"><Home class="size-3" aria-hidden="true" /></Icon>
    <Icon size="sm"><Home class="size-4" aria-hidden="true" /></Icon>
    <Icon size="md"><Home class="size-5" aria-hidden="true" /></Icon>
    <Icon size="lg"><Home class="size-6" aria-hidden="true" /></Icon>
    <Icon size="xl"><Home class="size-8" aria-hidden="true" /></Icon>
  </div>
{/if}

{#if story === 'Color & rotation'}
  <div class="flex items-center gap-4">
    <Icon color="var(--destructive)" rotation={0}>
      <Settings class="size-5" aria-hidden="true" />
    </Icon>
    <Icon color="var(--info)" rotation={45}>
      <Settings class="size-5" aria-hidden="true" />
    </Icon>
    <Icon color="var(--success)" rotation={90}>
      <Settings class="size-5" aria-hidden="true" />
    </Icon>
  </div>
{/if}

{#if story === 'Flip'}
  <div class="flex items-center gap-4">
    <Icon><User class="size-5" aria-hidden="true" /></Icon>
    <Icon flip="horizontal"><User class="size-5" aria-hidden="true" /></Icon>
    <Icon flip="vertical"><User class="size-5" aria-hidden="true" /></Icon>
  </div>
{/if}
