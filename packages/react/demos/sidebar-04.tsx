import Story from '../../components/story/Story'
import { Sidebar04 } from '@react-registry-blocks/sidebar-04/Sidebar04'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@react-registry/sidebar'
import { Separator } from '@react-registry/separator'

export default function Sidebar04Demo() {
  return (
    <Story
      title="Floating sidebar"
      description="Floats inside the inset with rounded corners and margins on all sides. Nested submenu items spell out the route tree."
    >
      <div
        className="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider defaultOpen className="h-full !min-h-0">
          <Sidebar04 />
          <SidebarInset>
            <header className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <h1 className="text-sm font-semibold">Getting Started</h1>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
                <div className="bg-muted/50 aspect-video rounded-xl" />
              </div>
              <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </Story>
  )
}
