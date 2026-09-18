export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar'
export type { SidebarProps, SidebarProviderProps, SidebarMenuButtonProps } from './sidebar'

// Re-export variant API from the sibling file (mirrors the Vue registry's
// `<name>.variants.ts` convention to avoid a component <-> index import cycle).
export { sidebarMenuButtonVariants, type SidebarMenuButtonVariants } from './sidebar.variants'
