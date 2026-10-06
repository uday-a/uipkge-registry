<script lang="ts">
  import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
  } from '@svelte-registry/context-menu'
  import { Copy, Pencil, Settings, Share2, Star, Trash, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let showBookmarks = $state(true)
  let showHistory = $state(false)
  let person = $state('jordan')
  let lastAction = $state('')

  function act(name: string) {
    lastAction = name
  }

  const triggerClass =
    'flex h-36 max-w-md items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground'
</script>

{#if story === 'Default'}
  <div class="space-y-3">
    <ContextMenu>
      <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={() => act('Copy')}><Copy /> Copy</ContextMenuItem>
        <ContextMenuItem onSelect={() => act('Rename')}><Pencil /> Rename</ContextMenuItem>
        <ContextMenuItem onSelect={() => act('Share')}><Share2 /> Share</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
    <p class="text-muted-foreground text-sm">{lastAction ? `Last action: ${lastAction}` : 'No action yet.'}</p>
  </div>
{/if}

{#if story === 'Checkbox items'}
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel>Panels</ContextMenuLabel>
      <ContextMenuCheckboxItem bind:checked={showBookmarks}>Bookmarks</ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem bind:checked={showHistory}>History</ContextMenuCheckboxItem>
    </ContextMenuContent>
  </ContextMenu>
{/if}

{#if story === 'Radio group'}
  <div class="space-y-3">
    <ContextMenu>
      <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Assign to</ContextMenuLabel>
        <ContextMenuRadioGroup bind:value={person}>
          <ContextMenuRadioItem value="jordan"><User /> Jordan Lee</ContextMenuRadioItem>
          <ContextMenuRadioItem value="priya"><User /> Priya Nair</ContextMenuRadioItem>
          <ContextMenuRadioItem value="sam"><User /> Sam Reyes</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
    <p class="text-muted-foreground text-sm">Assigned to: <span class="text-foreground font-medium">{person}</span></p>
  </div>
{/if}

{#if story === 'Submenu'}
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem><Star /> Favorite</ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger><Share2 /> Share to...</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onSelect={() => act('Email')}><Share2 /> Email</ContextMenuItem>
          <ContextMenuItem onSelect={() => act('Slack')}><Share2 /> Slack</ContextMenuItem>
          <ContextMenuItem onSelect={() => act('Copy link')}><Copy /> Copy link</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem variant="destructive" onSelect={() => act('Delete')}><Trash /> Delete</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
{/if}

{#if story === 'With shortcuts'}
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem><Copy /> Copy <ContextMenuShortcut>Ctrl C</ContextMenuShortcut></ContextMenuItem>
      <ContextMenuItem><Pencil /> Rename <ContextMenuShortcut>F2</ContextMenuShortcut></ContextMenuItem>
      <ContextMenuItem><Share2 /> Share <ContextMenuShortcut>Ctrl S</ContextMenuShortcut></ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
{/if}

{#if story === 'Disabled item'}
  <ContextMenu>
    <ContextMenuTrigger class={triggerClass}>Right-click here</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem><Settings /> Settings</ContextMenuItem>
      <ContextMenuItem disabled><Trash /> Delete (no permission)</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
{/if}
