<script lang="ts">
  import { Button, ButtonGroup } from '@svelte-registry/button'
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from '@svelte-registry/dropdown-menu'
  import { ChevronDown, ChevronRight, Copy, Download, Loader2, Mail, Plus, Share2, Trash2 } from '@lucide/svelte'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Variants'}
  <div class="flex flex-wrap gap-2">
    <Button>Default</Button>
    <Button variant="destructive">Destructive</Button>
    <Button variant="outline">Outline</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button variant="link">Link</Button>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-center gap-2">
    <Button size="xs">Extra small</Button>
    <Button size="sm">Small</Button>
    <Button>Default</Button>
    <Button size="lg">Large</Button>
  </div>
{/if}

{#if story === 'Icon-only'}
  <div class="flex flex-wrap items-center gap-2">
    <Button size="icon-sm" aria-label="icon">
      <Mail />
    </Button>
    <Button size="icon" aria-label="icon">
      <Mail />
    </Button>
    <Button size="icon-lg" aria-label="icon">
      <Mail />
    </Button>
  </div>
{/if}

{#if story === 'With icon'}
  <div class="flex flex-wrap gap-2">
    <Button>
      <Mail /> Email me
    </Button>
    <Button>
      Continue <ChevronRight />
    </Button>
    <Button variant="outline">
      <Plus /> New item
    </Button>
    <Button variant="destructive">
      <Trash2 /> Delete
    </Button>
  </div>
{/if}

{#if story === 'States'}
  <div class="flex flex-wrap gap-2">
    <Button disabled>Disabled</Button>
    <Button variant="outline" disabled>Outline disabled</Button>
    <Button disabled>
      <Loader2 class="animate-spin" /> Loading…
    </Button>
  </div>
{/if}

{#if story === 'Button Group & Split Buttons'}
  <div class="flex flex-wrap items-center gap-4">
    <ButtonGroup>
      <Button variant="outline" size="sm">Years</Button>
      <Button variant="outline" size="sm">Months</Button>
      <Button variant="outline" size="sm">Days</Button>
    </ButtonGroup>

    <ButtonGroup>
      <Button variant="default" size="sm">Save changes</Button>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet child({ props })}
            <Button {...props} variant="default" size="icon-sm" aria-label="More options">
              <ChevronDown class="size-3.5" />
            </Button>
          {/snippet}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Save and publish</DropdownMenuItem>
          <DropdownMenuItem>Save as draft</DropdownMenuItem>
          <DropdownMenuItem>Export as JSON</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>

    <ButtonGroup>
      <Button variant="secondary" size="xs">
        <Copy class="size-3" /> Copy
      </Button>
      <Button variant="secondary" size="xs">
        <Share2 class="size-3" /> Share
      </Button>
      <Button variant="secondary" size="xs">
        <Download class="size-3" /> Export
      </Button>
    </ButtonGroup>
  </div>
{/if}
