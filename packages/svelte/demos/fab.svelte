<script lang="ts">
  import { Fab } from '@svelte-registry/fab'
  import { Edit, Mail, MessageSquare, Plus, Send, Trash2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let clicks = $state(0)
</script>

{#if story === 'In a settings panel'}
  <div class="border-border relative max-w-md overflow-hidden rounded-xl border shadow-xs">
    <div class="flex flex-col gap-1.5 p-6">
      <h3 class="font-semibold tracking-tight">Team members</h3>
      <p class="text-muted-foreground text-sm">5 of 10 seats used.</p>
    </div>
    <div class="p-6 pt-0">
      <div class="space-y-2">
        <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
          <span>Alex Morgan</span>
          <span class="text-muted-foreground text-xs">Owner</span>
        </div>
        <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
          <span>Priya Sharma</span>
          <span class="text-muted-foreground text-xs">Admin</span>
        </div>
        <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
          <span>Diego Reyes</span>
          <span class="text-muted-foreground text-xs">Editor</span>
        </div>
      </div>
    </div>
    <Fab absolute position="bottom-right" ariaLabel="Invite member" onclick={() => clicks++}><Plus /></Fab>
  </div>
  <p class="text-muted-foreground mt-3 text-xs">Invites triggered: {clicks}</p>
{/if}

{#if story === 'Variants & sizes'}
  <div class="flex flex-wrap items-center gap-8">
    <div class="flex items-center gap-4">
      <Fab position="inline" ariaLabel="Add"><Plus /></Fab>
      <Fab variant="secondary" position="inline" ariaLabel="Edit"><Edit /></Fab>
      <Fab variant="destructive" position="inline" ariaLabel="Delete"><Trash2 /></Fab>
      <Fab variant="outline" position="inline" ariaLabel="Send"><Send /></Fab>
    </div>
    <div class="flex items-center gap-4">
      <Fab size="mini" position="inline" ariaLabel="Mini"><Plus /></Fab>
      <Fab size="default" position="inline" ariaLabel="Default"><Plus /></Fab>
      <Fab size="large" position="inline" ariaLabel="Large"><Plus /></Fab>
    </div>
  </div>
{/if}

{#if story === 'Extended FAB'}
  <div class="flex flex-wrap items-center gap-4">
    <Fab label="Compose" position="inline"><Mail /></Fab>
    <Fab label="New message" variant="secondary" position="inline"><MessageSquare /></Fab>
  </div>
{/if}

{#if story === 'Positioning'}
  <div class="border-border relative h-56 w-full overflow-hidden rounded-md border">
    <Fab position="top-left" ariaLabel="Top left"><Plus /></Fab>
    <Fab position="top-right" ariaLabel="Top right"><Plus /></Fab>
    <Fab position="bottom-left" ariaLabel="Bottom left"><Plus /></Fab>
    <Fab position="bottom-right" ariaLabel="Bottom right"><Plus /></Fab>
    <Fab position="bottom-center" label="Center" ariaLabel="Bottom center"><Plus /></Fab>
  </div>
{/if}

{#if story === 'With badge'}
  <div class="relative w-fit">
    <Fab position="inline" ariaLabel="Messages"><Mail /></Fab>
    <span
      class="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold"
      >3</span
    >
  </div>
{/if}

{#if story === 'Disabled'}
  <div class="flex items-center gap-4">
    <Fab disabled position="inline" ariaLabel="Disabled"><Plus /></Fab>
    <Fab disabled label="Disabled" position="inline"><Plus /></Fab>
  </div>
{/if}

{#if story === 'Fixed to viewport'}
  <p class="text-muted-foreground max-w-md text-sm">
    The button in the corner is live. It remains anchored to the viewport as you scroll.
  </p>
  <Fab label="Action" ariaLabel="Fixed action"><Plus /></Fab>
{/if}
