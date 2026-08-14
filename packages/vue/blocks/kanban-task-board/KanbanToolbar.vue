<script setup lang="ts">
import { Search, Filter, ChevronDown, X, LayoutGrid, List } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { priorityConfig, assignees, getInitials } from '@/composables/useKanban'

defineProps<{
  searchQuery: string
  selectedPriority: string | null
  selectedAssignee: string | null
  viewMode: 'board' | 'list'
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedPriority': [value: string | null]
  'update:selectedAssignee': [value: string | null]
  'update:viewMode': [value: 'board' | 'list']
}>()
</script>

<template>
  <div data-slot="kanban-board" class="mb-3 flex shrink-0 items-center gap-2">
    <div class="relative w-56">
      <Search class="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
      <Input
        :model-value="searchQuery"
        placeholder="Search tasks..."
        class="h-8 pl-8 text-sm"
        @update:model-value="$emit('update:searchQuery', String($event))"
      />
    </div>

    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs">
          <Filter class="size-3" />
          Priority
          <Badge
            v-if="selectedPriority"
            variant="default"
            class="ml-0.5 h-4 min-w-4 justify-center rounded px-1 text-xs"
          >
            1
          </Badge>
          <ChevronDown class="text-muted-foreground size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" class="w-40">
        <DropdownMenuItem
          v-for="(config, key) in priorityConfig"
          :key="key"
          class="gap-2"
          @click="$emit('update:selectedPriority', selectedPriority === key ? null : (key as string))"
        >
          <component :is="config.icon" :class="['size-3.5', config.class]" />
          {{ config.label }}
          <span v-if="selectedPriority === key" class="bg-primary ml-auto size-1.5 rounded-full" />
        </DropdownMenuItem>
        <DropdownMenuSeparator v-if="selectedPriority" />
        <DropdownMenuItem v-if="selectedPriority" @click="$emit('update:selectedPriority', null)">
          Clear filter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Badge
      v-if="selectedAssignee"
      variant="secondary"
      class="h-7 cursor-pointer gap-1 pr-1.5 text-xs"
      @click="$emit('update:selectedAssignee', null)"
    >
      {{ selectedAssignee }}
      <X class="size-3 opacity-50" />
    </Badge>

    <ToggleGroup
      type="single"
      size="sm"
      :model-value="viewMode"
      class="bg-muted ml-auto flex items-center gap-0.5 rounded-md p-0.5"
      @update:model-value="(v) => v && $emit('update:viewMode', v as 'board' | 'list')"
    >
      <ToggleGroupItem
        value="board"
        class="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
        title="Board view"
      >
        <LayoutGrid class="size-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        class="data-[state=on]:bg-background size-7 rounded-sm p-0 data-[state=on]:shadow-sm"
        title="List view"
      >
        <List class="size-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>

    <div class="flex items-center">
      <TooltipProvider :delay-duration="300">
        <Tooltip v-for="(a, key) in assignees" :key="key">
          <TooltipTrigger as-child>
            <button
              :class="[
                // rounded-full so the selected ring + focus ring trace the
                // Avatar's circular outline instead of the rectangular button.
                'ring-background focus-visible:ring-ring/50 relative -ml-1.5 rounded-full transition-all outline-none first:ml-0 focus-visible:ring-1',
                selectedAssignee === a.name
                  ? 'ring-primary z-20 ring-1'
                  : selectedAssignee && selectedAssignee !== a.name
                    ? 'opacity-40 hover:opacity-70'
                    : 'hover:z-10 hover:scale-110',
              ]"
              @click="$emit('update:selectedAssignee', selectedAssignee === a.name ? null : a.name)"
            >
              <Avatar class="border-background size-7 border-2">
                <AvatarFallback :class="['text-xs font-semibold', a.color]">
                  {{ getInitials(a.name) }}
                </AvatarFallback>
              </Avatar>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" class="text-xs">
            {{ a.name }}
            <span v-if="selectedAssignee === a.name" class="text-muted-foreground ml-1">(filtered)</span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>
