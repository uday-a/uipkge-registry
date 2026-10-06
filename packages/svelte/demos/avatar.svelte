<script lang="ts">
  import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@svelte-registry/avatar'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Sizes'}
  <div class="flex items-end gap-4">
    <Avatar class="size-6"><AvatarFallback class="text-xs">XS</AvatarFallback></Avatar>
    <Avatar class="size-8"><AvatarFallback class="text-xs">SM</AvatarFallback></Avatar>
    <Avatar class="size-10"><AvatarFallback>MD</AvatarFallback></Avatar>
    <Avatar class="size-12"><AvatarFallback>LG</AvatarFallback></Avatar>
    <Avatar class="size-16"><AvatarFallback>XL</AvatarFallback></Avatar>
    <Avatar class="size-20"><AvatarFallback>2XL</AvatarFallback></Avatar>
  </div>
{/if}

{#if story === 'Stack'}
  <div class="flex -space-x-2">
    <Avatar class="ring-background size-8 ring-2"><AvatarFallback>AD</AvatarFallback></Avatar>
    <Avatar class="ring-background size-8 ring-2"><AvatarFallback>RM</AvatarFallback></Avatar>
    <Avatar class="ring-background size-8 ring-2"><AvatarFallback>PK</AvatarFallback></Avatar>
    <Avatar class="ring-background size-8 ring-2"><AvatarFallback>+5</AvatarFallback></Avatar>
  </div>
{/if}

{#if story === 'Avatar group'}
  <div class="space-y-3">
    <AvatarGroup max={3} total={5}>
      <Avatar class="ring-background size-8 ring-2"><AvatarFallback>AD</AvatarFallback></Avatar>
      <Avatar class="ring-background size-8 ring-2"><AvatarFallback>RM</AvatarFallback></Avatar>
    </AvatarGroup>

    <AvatarGroup overlap={false}>
      <Avatar class="size-8"><AvatarFallback>AD</AvatarFallback></Avatar>
      <Avatar class="size-8"><AvatarFallback>RM</AvatarFallback></Avatar>
      <Avatar class="size-8"><AvatarFallback>PK</AvatarFallback></Avatar>
    </AvatarGroup>
  </div>
{/if}

{#if story === 'With image (broken → fallback)'}
  <Avatar class="size-12">
    <AvatarImage src="https://broken-url.example/img.jpg" alt="user" />
    <AvatarFallback>UI</AvatarFallback>
  </Avatar>
{/if}
