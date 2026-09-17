// Demo page wired by `npx shadcn@latest add https://uipkge.dev/r/react/sidebar-05.json`.
// The dual-rail layout needs both width vars on SidebarProvider (see
// Sidebar05.tsx for the why) -- they're inlined here so the route just
// works after install.
import type { CSSProperties } from 'react'
import { Sidebar05 } from '@/components/blocks/Sidebar05'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

const sidebarWidths = {
  '--sidebar-width': '19.5rem',
  '--sidebar-width-icon': '3.5rem',
} as CSSProperties

export default function Page() {
  return (
    <SidebarProvider data-slot="sidebar-05" style={sidebarWidths}>
      <Sidebar05 />
      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="size-7" />
          <h1 className="text-sm font-semibold">sidebar-05 demo</h1>
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
