import Story from '../../components/story/Story'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@react-registry/resizable'

export default function ResizableDemo() {
  return (
    <>
      <Story title="Default" description="Nested horizontal and vertical panel groups with draggable handles.">
        <ResizablePanelGroup direction="horizontal" className="border-border max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={33}>
            <div className="flex h-32 items-center justify-center text-sm">Left</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={67}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50}>
                <div className="flex h-16 items-center justify-center text-sm">Top right</div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-16 items-center justify-center text-sm">Bottom right</div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>

      <Story title="Horizontal only" description="Two panels split left/right by a vertical divider.">
        <ResizablePanelGroup direction="horizontal" className="border-border max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={40}>
            <div className="flex h-32 items-center justify-center text-sm">Sidebar</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={60}>
            <div className="flex h-32 items-center justify-center text-sm">Content</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>

      <Story title="Vertical only" description="Stack panels vertically — drag the horizontal handle to resize.">
        <ResizablePanelGroup direction="vertical" className="border-border h-48 max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-sm">Top</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-full items-center justify-center text-sm">Bottom</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>

      <Story title="Three panels" description="Two handles between three panels — typical IDE layout.">
        <ResizablePanelGroup direction="horizontal" className="border-border max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={20}>
            <div className="flex h-32 items-center justify-center text-sm">Files</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={55}>
            <div className="flex h-32 items-center justify-center text-sm">Editor</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25}>
            <div className="flex h-32 items-center justify-center text-sm">Inspector</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>

      <Story
        title="Min-size constraints"
        description="Panels respect min-size — try dragging the handle to either edge."
      >
        <ResizablePanelGroup direction="horizontal" className="border-border max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="flex h-32 items-center justify-center text-sm">min 20%</div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70} minSize={40}>
            <div className="flex h-32 items-center justify-center text-sm">min 40%</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>

      <Story title="Visible handle" description="Pass with-handle to render a grip indicator on the divider.">
        <ResizablePanelGroup direction="horizontal" className="border-border max-w-2xl rounded-md border">
          <ResizablePanel defaultSize={50}>
            <div className="flex h-32 items-center justify-center text-sm">One</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50}>
            <div className="flex h-32 items-center justify-center text-sm">Two</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Story>
    </>
  )
}
