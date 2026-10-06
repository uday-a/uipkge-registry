<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@svelte-registry/tooltip'
  import { Bell, Copy, Eye, EyeOff, GitBranch, Settings, Trash2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let visible = $state(false)
</script>

{#if story === 'Basic'}
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>Tooltip content</TooltipContent>
    </Tooltip>
  </TooltipProvider>
{/if}

{#if story === 'Sides'}
  <TooltipProvider delayDuration={200}>
    <div class="flex flex-wrap gap-3">
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Top</Button></TooltipTrigger>
        <TooltipContent side="top">Top placement</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Right</Button></TooltipTrigger>
        <TooltipContent side="right">Right placement</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Bottom</Button></TooltipTrigger>
        <TooltipContent side="bottom">Bottom placement</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Left</Button></TooltipTrigger>
        <TooltipContent side="left">Left placement</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
{/if}

{#if story === 'Icon-only buttons'}
  <TooltipProvider delayDuration={200}>
    <div class="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" aria-label="Settings"><Settings /></Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" aria-label="Notifications"><Bell /></Button>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" aria-label="Copy link"><Copy /></Button>
        </TooltipTrigger>
        <TooltipContent>Copy link</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" aria-label="Open on GitHub"><GitBranch /></Button>
        </TooltipTrigger>
        <TooltipContent>Open on GitHub</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="ghost" size="icon" aria-label="Delete" class="text-destructive hover:text-destructive">
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
{/if}

{#if story === 'With shortcut hint'}
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline" onclick={() => (visible = !visible)}>
          {#if visible}<Eye class="size-4" />{:else}<EyeOff class="size-4" />{/if}
          <span>{visible ? 'Visible' : 'Hidden'}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent class="flex items-center gap-2">
        <span>Toggle visibility</span>
        <kbd class="bg-background/20 rounded px-1.5 py-0.5 font-mono text-xs">⌘ ⇧ V</kbd>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
{/if}

{#if story === 'Disabled trigger'}
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger>
        <span tabindex="0">
          <Button disabled>Publish</Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>Add a title and at least one section before publishing.</TooltipContent>
    </Tooltip>
  </TooltipProvider>
{/if}

{#if story === 'Custom delay'}
  <div class="flex flex-wrap gap-3">
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Instant</Button></TooltipTrigger>
        <TooltipContent>Opens immediately</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider delayDuration={700}>
      <Tooltip>
        <TooltipTrigger><Button variant="outline" size="sm">Slow</Button></TooltipTrigger>
        <TooltipContent>Opens after 700ms</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </div>
{/if}
