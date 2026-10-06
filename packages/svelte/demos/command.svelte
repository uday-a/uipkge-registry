<script lang="ts">
  import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from '@svelte-registry/command'
  import { Button } from '@svelte-registry/button'
  import { Calendar, FileText, LoaderCircle, Plus, Search, Settings, Star, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let paletteOpen = $state(false)
  let loading = $state(true)
  let lastSelected = $state('')

  $effect(() => {
    if (story === 'Loading & empty state' && loading) {
      const t = setTimeout(() => (loading = false), 1200)
      return () => clearTimeout(t)
    }
  })

  function picked(value: string) {
    lastSelected = value
    paletteOpen = false
  }
</script>

{#if story === 'Default'}
  <Command class="max-w-md rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem value="calendar"><Calendar /> Calendar</CommandItem>
        <CommandItem value="search"><Search /> Search docs</CommandItem>
        <CommandItem value="settings"><Settings /> Settings</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
{/if}

{#if story === 'With shortcuts'}
  <Command class="max-w-md rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Actions">
        <CommandItem value="new-file"><FileText /> New file <CommandShortcut>Ctrl N</CommandShortcut></CommandItem>
        <CommandItem value="new-folder"><Plus /> New folder <CommandShortcut>Ctrl Shift N</CommandShortcut></CommandItem>
        <CommandItem value="starred"><Star /> Starred <CommandShortcut>Ctrl S</CommandShortcut></CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
{/if}

{#if story === 'Multiple groups + separator'}
  <Command class="max-w-md rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="People">
        <CommandItem value="jordan"><User /> Jordan Lee</CommandItem>
        <CommandItem value="priya"><User /> Priya Nair</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Files">
        <CommandItem value="roadmap"><FileText /> Roadmap.md</CommandItem>
        <CommandItem value="changelog"><FileText /> Changelog.md</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
{/if}

{#if story === 'CommandDialog (modal)'}
  <div class="space-y-3">
    <Button variant="outline" onclick={() => (paletteOpen = true)}>Open palette (Ctrl K)</Button>
    <p class="text-muted-foreground text-sm">
      {lastSelected ? `Last selected: ${lastSelected}` : 'Nothing selected yet.'}
    </p>
    <CommandDialog bind:open={paletteOpen}>
      <CommandInput placeholder="Type a command or search..." autoFocus />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="calendar" onSelect={picked}><Calendar /> Calendar</CommandItem>
          <CommandItem value="search" onSelect={picked}><Search /> Search docs</CommandItem>
          <CommandItem value="settings" onSelect={picked}><Settings /> Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
{/if}

{#if story === 'Loading & empty state'}
  <div class="max-w-md space-y-3">
    <Command class="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        {#if loading}
          <div class="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
            <LoaderCircle class="size-4 animate-spin" /> Loading commands...
          </div>
        {:else}
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="calendar"><Calendar /> Calendar</CommandItem>
            <CommandItem value="settings"><Settings /> Settings</CommandItem>
          </CommandGroup>
        {/if}
      </CommandList>
    </Command>
    <Button size="sm" variant="outline" onclick={() => (loading = true)}>Replay loading</Button>
  </div>
{/if}
