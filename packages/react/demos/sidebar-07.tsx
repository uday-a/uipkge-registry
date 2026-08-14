import Story from '../../components/story/Story'
import { Sidebar07 } from '@react-registry-blocks/sidebar-07/Sidebar07'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@react-registry/sidebar'

export default function Sidebar07Demo() {
  return (
    <Story
      title="Sidebar with bottom action bar"
      description="Workspace pill + ⌘K search at the top, grouped nav (Dashboard / Management / Content) with badges, user pill above a five-icon action toolbar (Settings, Help, Notifications, Command, Log out)."
    >
      <div
        className="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider defaultOpen className="h-full !min-h-0">
          <Sidebar07 />
          <SidebarInset>
            <header className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-sm font-semibold">Analytics</h1>
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
