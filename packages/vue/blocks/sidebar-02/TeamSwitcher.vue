<script setup lang="ts">
// Edit teams + activeTeam below to match your tenant model. The dropdown
// is the full team switcher pattern -- avatar tile, label, kbd shortcut,
// and a "Add team" footer row. Wire setActive() to your tenant API.
import { h, ref } from 'vue'
import { AudioWaveform, Check, ChevronsUpDown, Command, Plus } from 'lucide-vue-next'

// 4-quadrant uipkge logo. Inline functional component so it can sit
// next to Lucide icons in the teams array without an extra file.
const UipkgeMark = (props: { class?: string }) =>
  h('svg', { viewBox: '0 0 24 24', class: props.class, fill: 'currentColor', 'aria-hidden': 'true' }, [
    h('rect', { x: 2, y: 2, width: 9, height: 9, rx: 1.5 }),
    h('rect', { x: 13, y: 2, width: 9, height: 9, rx: 1.5, opacity: 0.55 }),
    h('rect', { x: 2, y: 13, width: 9, height: 9, rx: 1.5, opacity: 0.55 }),
    h('rect', { x: 13, y: 13, width: 9, height: 9, rx: 1.5 }),
  ])
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

const teams = [
  { name: 'uipkge', logo: UipkgeMark, plan: 'UI registry' },
  { name: 'uipkge HRMS', logo: AudioWaveform, plan: 'Vertical' },
  { name: 'uipkge Hospital', logo: Command, plan: 'Vertical' },
]

const { isMobile } = useSidebar()
const activeTeam = ref(teams[0]!)
function setActive(team: (typeof teams)[number]) {
  activeTeam.value = team
}
</script>

<template>
  <SidebarMenu data-slot="sidebar-02">
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:!justify-center"
          >
            <div
              class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:size-6"
            >
              <component :is="activeTeam.logo" class="size-4 group-data-[collapsible=icon]:size-3.5" />
            </div>
            <div class="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span class="font-display truncate font-bold">{{ activeTeam.name }}</span>
              <span class="text-muted-foreground truncate text-xs">{{ activeTeam.plan }}</span>
            </div>
            <ChevronsUpDown class="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="start"
          :side-offset="4"
        >
          <DropdownMenuLabel class="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
          <DropdownMenuItem v-for="(team, i) in teams" :key="team.name" class="gap-2 p-2" @select="setActive(team)">
            <div class="flex size-6 items-center justify-center rounded-sm border">
              <component :is="team.logo" class="size-3.5 shrink-0" />
            </div>
            {{ team.name }}
            <Check v-if="activeTeam === team" class="ml-auto size-4" />
            <DropdownMenuShortcut v-else>⌘{{ i + 1 }}</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="gap-2 p-2">
            <div class="bg-background flex size-6 items-center justify-center rounded-md border">
              <Plus class="size-4" />
            </div>
            <div class="text-muted-foreground font-medium">Add team</div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
