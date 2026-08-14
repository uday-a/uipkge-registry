import type { InjectionKey, ComputedRef, Component } from 'vue'

// Shared provide/inject key for the kanban-board link component.
// KanbanBoard provides it; KanbanCard, KanbanListView, KanbanTaskSheet,
// and SubtaskList inject it so task links render with the consumer's
// router component (NuxtLink, RouterLink) or a plain <a> by default.
export const kanbanLinkKey: InjectionKey<ComputedRef<string | Component>> = Symbol('kanbanLink')
