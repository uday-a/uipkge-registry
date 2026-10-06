<script lang="ts">
  import { Dock, type DockItem } from '@svelte-registry/dock'
  import {
    Calendar,
    Camera,
    Cloud,
    FileText,
    Folder,
    Mail,
    MessageCircle,
    Music,
    Search,
    Settings,
    Terminal,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let activeId = $state('finder')
  let lastLaunched = $state('—')

  const appDefs = [
    { id: 'finder', label: 'Finder', icon: Folder },
    { id: 'mail', label: 'Mail', icon: Mail },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'terminal', label: 'Terminal', icon: Terminal },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const apps = $derived<DockItem[]>(
    appDefs.map((a) => ({
      ...a,
      active: a.id === activeId,
      handler: () => (activeId = a.id),
    })),
  )

  const toolDefs = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'camera', label: 'Camera', icon: Camera },
    { id: 'chat', label: 'Messages', icon: MessageCircle },
    { id: 'cloud', label: 'Cloud', icon: Cloud },
  ]

  const tools = $derived<DockItem[]>(
    toolDefs.map((t) => ({ ...t, handler: () => (lastLaunched = t.label) })),
  )
</script>

{#if story === 'App launcher'}
  <div
    class="flex h-56 flex-col justify-between rounded-lg bg-gradient-to-b from-sky-100 to-indigo-200 p-6 dark:from-sky-950 dark:to-indigo-950"
  >
    <p class="text-sm text-slate-700 dark:text-slate-200">
      Active app: <span class="font-medium">{activeId}</span>
    </p>
    <div class="flex justify-center">
      <Dock items={apps} />
    </div>
  </div>
{/if}

{#if story === 'In a desktop shell'}
  <div
    class="border-border/60 relative flex h-64 items-end justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-zinc-800 to-zinc-950"
  >
    <div class="absolute top-4 left-4 text-sm font-medium text-white/90">My Desktop</div>
    <Dock items={apps} class="mb-3" />
  </div>
{/if}

{#if story === 'Click handlers'}
  <div class="border-border max-w-md rounded-xl border shadow-xs">
    <div class="flex flex-col gap-1.5 p-6 pb-2">
      <h3 class="font-semibold tracking-tight">Quick tools</h3>
      <p class="text-muted-foreground text-sm">Click a dock icon to launch it.</p>
    </div>
    <div class="p-6 pt-2">
      <p class="text-muted-foreground text-sm">
        Last launched: <span class="text-foreground font-medium">{lastLaunched}</span>
      </p>
    </div>
  </div>
  <div class="bg-muted/30 mt-4 flex items-end justify-center rounded-lg py-6">
    <Dock items={tools} />
  </div>
{/if}

{#if story === 'Magnification tuning'}
  <div class="grid gap-4">
    <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
      <Dock items={apps} baseSize={36} />
    </div>
    <div class="border-border/60 bg-muted/40 flex items-end justify-center rounded-lg border py-6">
      <Dock items={apps} magnification={2} distance={150} />
    </div>
  </div>
{/if}

{#if story === 'Custom styling'}
  <div class="flex items-end justify-center rounded-lg bg-zinc-900 py-6">
    <Dock items={apps} class="border-zinc-700 bg-zinc-800/80 text-zinc-100" />
  </div>
{/if}

{#if story === 'Tooltips off'}
  <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
    <Dock items={apps} showTooltips={false} />
  </div>
{/if}
