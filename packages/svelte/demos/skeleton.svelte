<script lang="ts">
  import { Skeleton, SkeletonGroup, SkeletonLoader, SkeletonText } from '@svelte-registry/skeleton'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Profile placeholder'}
  <div class="flex items-center gap-3">
    <Skeleton variant="avatar" />
    <div class="flex-1 space-y-2">
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="65%" />
    </div>
  </div>
{/if}

{#if story === 'Card placeholder'}
  <SkeletonGroup class="max-w-sm rounded-xl border p-4">
    <Skeleton variant="image" width="100%" height="120px" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="text" />
    <Skeleton variant="text" width="80%" />
  </SkeletonGroup>
{/if}

{#if story === 'SkeletonText paragraph'}
  <SkeletonText lines={4} firstLineWidth="90%" lastLineWidth="60%" />
{/if}

{#if story === 'SkeletonLoader presets'}
  <div class="grid gap-6 md:grid-cols-2">
    <div>
      <p class="text-muted-foreground mb-2 text-xs font-medium">article</p>
      <SkeletonLoader variant="article" rows={2} />
    </div>
    <div>
      <p class="text-muted-foreground mb-2 text-xs font-medium">card-avatar</p>
      <SkeletonLoader variant="card-avatar" rows={2} />
    </div>
    <div>
      <p class="text-muted-foreground mb-2 text-xs font-medium">list-item-three-line × 2</p>
      <SkeletonLoader variant="list-item-three-line" rows={2} />
    </div>
    <div>
      <p class="text-muted-foreground mb-2 text-xs font-medium">table × 4</p>
      <SkeletonLoader variant="table" rows={4} />
    </div>
  </div>
{/if}

{#if story === 'SkeletonLoader atoms'}
  <div class="flex flex-wrap items-center gap-3">
    <SkeletonLoader variant="avatar" />
    <SkeletonLoader variant="button" />
    <SkeletonLoader variant="badge" />
    <SkeletonLoader variant="chip" />
    <SkeletonLoader variant="tab" />
  </div>
{/if}

{#if story === 'Image placeholders'}
  <div class="flex flex-wrap items-end gap-4">
    <SkeletonLoader variant="image-small" />
    <SkeletonLoader variant="image" class="max-w-xs" />
  </div>
{/if}
