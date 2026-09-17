// Demo page wired by `npx shadcn@latest add https://uipkge.dev/r/react/sidebar-04.json`.
// Visit /sidebar-04-demo after install to see the block without
// editing your own pages. Free to edit or delete me.
import { Sidebar04 } from '@/components/blocks/sidebar-04/Sidebar04'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function Page() {
  return (
    <SidebarProvider data-slot="sidebar-04">
      <Sidebar04 />
      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="size-7" />
          <h1 className="text-sm font-semibold">sidebar-04 demo</h1>
        </header>
        <div className="flex-1 p-6">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 mt-4 min-h-[60vh] rounded-xl" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
