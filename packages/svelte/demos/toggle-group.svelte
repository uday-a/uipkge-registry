<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '@svelte-registry/toggle-group'
  import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let align = $state<string | string[]>('center')
  let formats = $state<string | string[]>(['bold'])
</script>

{#if story === 'Single select'}
  <ToggleGroup type="single" bind:value={align} aria-label="Text alignment">
    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
  </ToggleGroup>
{/if}

{#if story === 'Multiple select'}
  <ToggleGroup type="multiple" bind:value={formats} aria-label="Text formatting">
    <ToggleGroupItem value="bold" aria-label="Bold"><Bold class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Italic"><Italic class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="underline" aria-label="Underline"><Underline class="size-4" /></ToggleGroupItem>
  </ToggleGroup>
{/if}

{#if story === 'Variants'}
  <div class="flex flex-col gap-3">
    <ToggleGroup type="single" variant="default" aria-label="Default variant">
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" variant="outline" aria-label="Outline variant">
      <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
    </ToggleGroup>
  </div>
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-col items-start gap-3">
    <ToggleGroup type="single" size="sm" aria-label="Small">
      <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
      <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" size="default" aria-label="Default">
      <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
      <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
    </ToggleGroup>
    <ToggleGroup type="single" size="lg" aria-label="Large">
      <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
      <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
    </ToggleGroup>
  </div>
{/if}

{#if story === 'With spacing'}
  <ToggleGroup type="single" variant="outline" spacing={2} aria-label="Spaced">
    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
  </ToggleGroup>
{/if}

{#if story === 'Disabled'}
  <ToggleGroup type="single" disabled aria-label="Disabled group">
    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
  </ToggleGroup>
{/if}

{#if story === 'Static (no indicator)'}
  <ToggleGroup type="single" animated={false} aria-label="Static">
    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter class="size-4" /></ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight class="size-4" /></ToggleGroupItem>
  </ToggleGroup>
{/if}
