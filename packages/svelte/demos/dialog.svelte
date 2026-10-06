<script lang="ts">
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogScrollContent,
    DialogTitle,
    DialogTrigger,
  } from '@svelte-registry/dialog'
  import { Button } from '@svelte-registry/button'
  import { Check, Copy } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let copied = $state(false)

  function copyLink() {
    copied = true
    setTimeout(() => (copied = false), 1500)
  }

  const inputClass =
    'bg-background border-input h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
  const labelClass = 'text-sm font-medium'
</script>

{#if story === 'Form dialog'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Edit profile</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-2">
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="name" class="{labelClass} text-right">Name</label>
          <input id="name" value="Jordan Lee" class="{inputClass} col-span-3" />
        </div>
        <div class="grid grid-cols-4 items-center gap-4">
          <label for="username" class="{labelClass} text-right">Username</label>
          <input id="username" value="@jordan" class="{inputClass} col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <DialogClose>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Cancel</Button>
          {/snippet}
        </DialogClose>
        <Button size="sm">Save changes</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'Share link'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Share</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share this document</DialogTitle>
        <DialogDescription>Anyone with the link can view this document.</DialogDescription>
      </DialogHeader>
      <div class="flex items-center gap-2">
        <input value="https://uipkge.dev/docs/dialog" readonly class="{inputClass} flex-1 font-mono text-xs" />
        <Button size="sm" variant="outline" onclick={copyLink}>
          {#if copied}
            <Check /> Copied
          {:else}
            <Copy /> Copy
          {/if}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'New project — multi-section form'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button {...props}>New project</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>New project</DialogTitle>
        <DialogDescription>Spin up a project with its own workspace and billing.</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-2">
        <div class="space-y-1.5">
          <label for="project" class={labelClass}>Project name</label>
          <input id="project" placeholder="acme-dashboard" class={inputClass} />
        </div>
        <div class="space-y-1.5">
          <label for="slug" class={labelClass}>URL slug</label>
          <input id="slug" placeholder="acme-dashboard" class="{inputClass} font-mono" />
        </div>
        <div class="space-y-1.5">
          <label for="desc" class={labelClass}>Description</label>
          <input id="desc" placeholder="What is this project for?" class={inputClass} />
        </div>
      </div>
      <DialogFooter showCloseButton>
        <Button size="sm">Create project</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'Onboarding card'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="secondary" {...props}>Show welcome</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Welcome to UIPKGE</DialogTitle>
        <DialogDescription>You are one step away from your first component install.</DialogDescription>
      </DialogHeader>
      <ol class="list-decimal space-y-2 pl-5 text-sm">
        <li>Pick a component from the registry.</li>
        <li>Copy the install command.</li>
        <li>Own the source in your project.</li>
      </ol>
      <DialogFooter>
        <Button size="sm">Get started</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'Pricing comparison'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Compare plans</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Plans</DialogTitle>
        <DialogDescription>Start free, upgrade when you need more.</DialogDescription>
      </DialogHeader>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-lg border p-4">
          <p class="text-sm font-semibold">Starter</p>
          <p class="mt-1 text-2xl font-bold">$0</p>
          <p class="text-muted-foreground mt-1 text-xs">10 components</p>
        </div>
        <div class="border-primary rounded-lg border p-4">
          <p class="text-sm font-semibold">Pro</p>
          <p class="mt-1 text-2xl font-bold">$16</p>
          <p class="text-muted-foreground mt-1 text-xs">Unlimited + blocks</p>
        </div>
      </div>
      <DialogFooter>
        <Button size="sm">Choose Pro</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'Connect integrations'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Integrations</Button>
      {/snippet}
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Connect integrations</DialogTitle>
        <DialogDescription>Sync your tools with two clicks.</DialogDescription>
      </DialogHeader>
      <div class="space-y-2">
        {#each ['GitHub', 'Linear', 'Slack'] as app (app)}
          <div class="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <span class="text-sm font-medium">{app}</span>
            <Button size="sm" variant="outline">Connect</Button>
          </div>
        {/each}
      </div>
    </DialogContent>
  </Dialog>
{/if}

{#if story === 'Long content with scroll'}
  <Dialog>
    <DialogTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Terms of service</Button>
      {/snippet}
    </DialogTrigger>
    <DialogScrollContent>
      <DialogHeader>
        <DialogTitle>Terms of service</DialogTitle>
        <DialogDescription>Last updated March 2025. Scroll to read everything.</DialogDescription>
      </DialogHeader>
      <div class="space-y-3 text-sm">
        {#each Array.from({ length: 8 }, (_, i) => i + 1) as section (section)}
          <div>
            <p class="font-semibold">Section {section}</p>
            <p class="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
            </p>
          </div>
        {/each}
      </div>
      <DialogFooter showCloseButton>
        <Button size="sm">Accept</Button>
      </DialogFooter>
    </DialogScrollContent>
  </Dialog>
{/if}
