<script lang="ts">
  import { ThemeSwitch } from '@svelte-registry/theme-switch'

  let { story }: { story: string } = $props()

  let theme = $state<'light' | 'dark' | 'system' | 'black'>('system')
</script>

{#if story === 'Cards'}
  <ThemeSwitch bind:value={theme} variant="cards" class="max-w-md" />
{/if}

{#if story === 'Icons'}
  <ThemeSwitch bind:value={theme} variant="icons" />
{/if}

{#if story === 'Icon only'}
  <ThemeSwitch bind:value={theme} variant="icon-only" />
{/if}

{#if story === 'Dropdown'}
  <ThemeSwitch bind:value={theme} variant="dropdown" />
{/if}

{#if story === 'Pill'}
  <ThemeSwitch bind:value={theme} variant="pill" class="max-w-md" />
{/if}

{#if story === 'Pill — 4 states'}
  <ThemeSwitch bind:value={theme} variant="pill-4" class="max-w-md" />
{/if}

{#if story === 'Switch'}
  <ThemeSwitch bind:value={theme} variant="switch" />
{/if}
