<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from '@svelte-registry/dropdown-menu'
  import {
    ChevronDown,
    Cloud,
    CreditCard,
    GitBranch,
    HelpCircle,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    MoreHorizontal,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users,
  } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let showStatus = $state(true)
  let showActivity = $state(false)
  let showPanel = $state(true)

  let position = $state('center')
</script>

{#if story === 'Account menu'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open menu</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>My account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem><User class="size-4" /> Profile</DropdownMenuItem>
        <DropdownMenuItem><CreditCard class="size-4" /> Billing</DropdownMenuItem>
        <DropdownMenuItem><Settings class="size-4" /> Settings</DropdownMenuItem>
        <DropdownMenuItem><Keyboard class="size-4" /> Shortcuts</DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive focus:text-destructive">
        <LogOut class="size-4" /> Log out
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'With shortcuts'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Edit</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuItem>
        New tab
        <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        New window
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem disabled>
        New private window
        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        Print
        <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'With checkbox items'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>View options</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem bind:checked={showStatus}>Status bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={showActivity}>Activity bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={showPanel}>Panel</DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'With radio group'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Panel position</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>Panel position</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup bind:value={position}>
        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="center">Center</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'With submenus'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Help</Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56">
      <DropdownMenuItem><LifeBuoy class="size-4" /> Support</DropdownMenuItem>
      <DropdownMenuItem><GitBranch class="size-4" /> GitHub</DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger><UserPlus class="size-4" /> Invite teammates</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem><Mail class="size-4" /> Email</DropdownMenuItem>
          <DropdownMenuItem><MessageSquare class="size-4" /> Message</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem><PlusCircle class="size-4" /> Send invite link</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuItem><HelpCircle class="size-4" /> Keyboard shortcuts</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled><Cloud class="size-4" /> API (coming soon)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'Icon trigger (row action)'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button variant="ghost" size="icon" aria-label="Row actions" {...props}>
          <MoreHorizontal class="size-4" />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-44">
      <DropdownMenuItem>Duplicate</DropdownMenuItem>
      <DropdownMenuItem>Rename…</DropdownMenuItem>
      <DropdownMenuItem>Move to folder…</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}

{#if story === 'Action menu'}
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button {...props}>
          <Plus class="size-3.5" /> New
          <ChevronDown class="size-3.5" />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start" class="w-44">
      <DropdownMenuItem><Plus class="size-4" /> Project</DropdownMenuItem>
      <DropdownMenuItem><Users class="size-4" /> Team</DropdownMenuItem>
      <DropdownMenuItem><Cloud class="size-4" /> Workspace</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
{/if}
