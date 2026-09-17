import Story from '../../components/story/Story'
import { Sidebar02 } from '@react-registry-blocks/sidebar-02/Sidebar02'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@react-registry/sidebar'
import { Separator } from '@react-registry/separator'

export default function Sidebar02Demo() {
  return (
    <Story
      title="Full app sidebar"
      description="TeamSwitcher header, primary nav, projects section, secondary support links, and a user dropdown footer."
    >
      <div
        className="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider defaultOpen className="h-full !min-h-0">
          <Sidebar02 />
          <SidebarInset>
            <header className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <h1 className="text-sm font-semibold">Workspace</h1>
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
