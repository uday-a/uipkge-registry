import Story from '../../components/story/Story'
import { Sidebar03 } from '@react-registry-blocks/sidebar-03/Sidebar03'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@react-registry/sidebar'
import { Separator } from '@react-registry/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@react-registry/breadcrumb'

export default function Sidebar03Demo() {
  return (
    <Story
      title="Docs sidebar with search + version switcher"
      description="Version switcher in the header, a search input below, and collapsible groups of nav items. Common docs-site shape."
    >
      <div
        className="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider defaultOpen className="h-full !min-h-0">
          <Sidebar03 />
          <SidebarInset>
            <header className="flex h-14 items-center gap-3 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-5" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
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
