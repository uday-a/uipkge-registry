'use client'

import { Search } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar'

export function SearchForm() {
  return (
    <form data-slot="sidebar-03">
      <SidebarGroup className="py-0">
        <SidebarGroupContent>
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            type="text"
            placeholder="Search the docs..."
            allowClear
            prefix={<Search className="text-muted-foreground size-3.5" />}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  )
}
