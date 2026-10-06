<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@svelte-registry/resizable'

  let { story }: { story: string } = $props()
</script>

{#if story === 'Default'}
  <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={33}>
      <div class="flex h-32 items-center justify-center text-sm">Left</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={67}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={50}>
          <div class="flex h-16 items-center justify-center text-sm">Top right</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div class="flex h-16 items-center justify-center text-sm">Bottom right</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}

{#if story === 'Horizontal only'}
  <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={40}>
      <div class="flex h-32 items-center justify-center text-sm">Sidebar</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={60}>
      <div class="flex h-32 items-center justify-center text-sm">Content</div>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}

{#if story === 'Vertical only'}
  <ResizablePanelGroup direction="vertical" class="border-border h-48 max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={50}>
      <div class="flex h-full items-center justify-center text-sm">Top</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={50}>
      <div class="flex h-full items-center justify-center text-sm">Bottom</div>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}

{#if story === 'Three panels'}
  <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={20}>
      <div class="flex h-32 items-center justify-center text-sm">Files</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={55}>
      <div class="flex h-32 items-center justify-center text-sm">Editor</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={25}>
      <div class="flex h-32 items-center justify-center text-sm">Inspector</div>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}

{#if story === 'Min-size constraints'}
  <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={30} minSize={20}>
      <div class="flex h-32 items-center justify-center text-sm">min 20%</div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel defaultSize={70} minSize={40}>
      <div class="flex h-32 items-center justify-center text-sm">min 40%</div>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}

{#if story === 'Visible handle'}
  <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
    <ResizablePanel defaultSize={50}>
      <div class="flex h-32 items-center justify-center text-sm">One</div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={50}>
      <div class="flex h-32 items-center justify-center text-sm">Two</div>
    </ResizablePanel>
  </ResizablePanelGroup>
{/if}
