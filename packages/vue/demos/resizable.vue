<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
</script>

<template>
  <Story title="Default" description="Nested horizontal and vertical panel groups with draggable handles.">
    <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
      <ResizablePanel :default-size="33">
        <div class="flex h-32 items-center justify-center text-sm">Left</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="67">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel :default-size="50">
            <div class="flex h-16 items-center justify-center text-sm">Top right</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel :default-size="50">
            <div class="flex h-16 items-center justify-center text-sm">Bottom right</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>

  <Story title="Horizontal only" description="Two panels split left/right by a vertical divider.">
    <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
      <ResizablePanel :default-size="40">
        <div class="flex h-32 items-center justify-center text-sm">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="60">
        <div class="flex h-32 items-center justify-center text-sm">Content</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>

  <Story title="Vertical only" description="Stack panels vertically — drag the horizontal handle to resize.">
    <ResizablePanelGroup direction="vertical" class="border-border h-48 max-w-2xl rounded-md border">
      <ResizablePanel :default-size="50">
        <div class="flex h-full items-center justify-center text-sm">Top</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="50">
        <div class="flex h-full items-center justify-center text-sm">Bottom</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>

  <Story title="Three panels" description="Two handles between three panels — typical IDE layout.">
    <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
      <ResizablePanel :default-size="20">
        <div class="flex h-32 items-center justify-center text-sm">Files</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="55">
        <div class="flex h-32 items-center justify-center text-sm">Editor</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="25">
        <div class="flex h-32 items-center justify-center text-sm">Inspector</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>

  <Story title="Min-size constraints" description="Panels respect min-size — try dragging the handle to either edge.">
    <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
      <ResizablePanel :default-size="30" :min-size="20">
        <div class="flex h-32 items-center justify-center text-sm">min 20%</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel :default-size="70" :min-size="40">
        <div class="flex h-32 items-center justify-center text-sm">min 40%</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>

  <Story title="Visible handle" description="Pass with-handle to render a grip indicator on the divider.">
    <ResizablePanelGroup direction="horizontal" class="border-border max-w-2xl rounded-md border">
      <ResizablePanel :default-size="50">
        <div class="flex h-32 items-center justify-center text-sm">One</div>
      </ResizablePanel>
      <ResizableHandle with-handle />
      <ResizablePanel :default-size="50">
        <div class="flex h-32 items-center justify-center text-sm">Two</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </Story>
</template>
