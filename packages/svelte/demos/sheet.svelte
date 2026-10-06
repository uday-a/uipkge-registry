<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@svelte-registry/sheet'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default (left)'}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open left sheet</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent side="left">
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes to your profile here. Click save when you're done.</SheetDescription>
      </SheetHeader>
      <div class="grid gap-4 px-4 py-2 text-sm">
        <div class="grid gap-1">
          <span class="font-medium">Name</span>
          <span class="text-muted-foreground">Pedro Duarte</span>
        </div>
        <div class="grid gap-1">
          <span class="font-medium">Username</span>
          <span class="text-muted-foreground">@peduarte</span>
        </div>
      </div>
      <SheetFooter>
        <Button>Save changes</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
{/if}

{#if story === 'Right (default drawer)'}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open right sheet</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Cart</SheetTitle>
        <SheetDescription>3 items · estimated total $182.50</SheetDescription>
      </SheetHeader>
      <div class="space-y-3 px-4 py-2 text-sm">
        <div class="flex justify-between">
          <span>Mechanical keyboard</span>
          <span class="tabular-nums">$129.00</span>
        </div>
        <div class="flex justify-between">
          <span>USB-C cable (2m)</span>
          <span class="tabular-nums">$14.50</span>
        </div>
        <div class="flex justify-between">
          <span>Desk mat</span>
          <span class="tabular-nums">$39.00</span>
        </div>
      </div>
      <SheetFooter>
        <Button>Checkout</Button>
        <SheetClose>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Continue shopping</Button>
          {/snippet}
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
{/if}

{#if story === 'Top'}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open top sheet</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent side="top">
      <SheetHeader>
        <SheetTitle>Scheduled maintenance</SheetTitle>
        <SheetDescription>Sunday 02:00 – 04:00 UTC. Expect brief interruptions.</SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
{/if}

{#if story === 'Bottom (mobile pattern)'}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open bottom sheet</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent side="bottom">
      <SheetHeader>
        <SheetTitle>Share</SheetTitle>
        <SheetDescription>Send this link to your team.</SheetDescription>
      </SheetHeader>
      <div class="flex gap-2 px-4 pb-4">
        <Button class="flex-1">Copy link</Button>
        <SheetClose>
          {#snippet child({ props })}
            <Button variant="outline" {...props}>Cancel</Button>
          {/snippet}
        </SheetClose>
      </div>
    </SheetContent>
  </Sheet>
{/if}

{#if story === 'Long scrollable content'}
  <Sheet>
    <SheetTrigger>
      {#snippet child({ props })}
        <Button variant="outline" {...props}>Open long sheet</Button>
      {/snippet}
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Terms of service</SheetTitle>
        <SheetDescription>Last updated January 2025.</SheetDescription>
      </SheetHeader>
      <div class="space-y-3 overflow-y-auto px-4 py-2 text-sm">
        {#each Array.from({ length: 12 }, (_, i) => i + 1) as n (n)}
          <p class="text-muted-foreground">
            {n}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
        {/each}
      </div>
      <SheetFooter>
        <Button>Accept</Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
{/if}
