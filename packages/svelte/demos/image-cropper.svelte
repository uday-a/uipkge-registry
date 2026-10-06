<script lang="ts">
  import { ImageCropper } from '@svelte-registry/image-cropper'

  let { story }: { story: string } = $props()

  const src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80'
  const portrait = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1200&fit=crop&q=80'
</script>

{#if story === 'Default'}
  <ImageCropper {src} alt="Coast" />
{/if}

{#if story === 'Show zoom'}
  <ImageCropper {src} alt="Coast" showZoom />
{/if}

{#if story === '16 / 9'}
  <ImageCropper {src} alt="Coast" aspectRatio={16 / 9} showZoom />
{/if}

{#if story === '4 / 3'}
  <ImageCropper {src} alt="Coast" aspectRatio={4 / 3} showZoom />
{/if}

{#if story === 'Portrait'}
  <ImageCropper src={portrait} alt="City" aspectRatio={3 / 4} showZoom />
{/if}

{#if story === 'Circle'}
  <ImageCropper {src} alt="Coast" rounded="full" class="max-w-xs" showZoom />
{/if}

{#if story === 'Banner'}
  <ImageCropper {src} alt="Coast" aspectRatio={21 / 9} showZoom />
{/if}

{#if story === 'Zoom limits'}
  <ImageCropper {src} alt="Coast" minZoom={1} maxZoom={2} showZoom />
{/if}

{#if story === 'Disabled'}
  <ImageCropper {src} alt="Coast" disabled showZoom />
{/if}

{#if story === 'No zoom control'}
  <ImageCropper {src} alt="Coast" />
{/if}
