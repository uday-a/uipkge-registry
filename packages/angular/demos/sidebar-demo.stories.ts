import type { AngularStory } from './stories'

/** Story cards for the sidebar Angular demo (titles + descriptions mirror demos/react/sidebar.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Collapsible sidebar with header, group label, and menu items.',
  },
  {
    title: 'Collapsible icon',
    description: "collapsible='icon' shrinks the sidebar to a 48px rail with icon-only buttons when toggled.",
  },
  {
    title: 'Floating variant',
    description: "variant='floating' detaches the sidebar from the edge with rounded corners and a subtle shadow.",
  },
  {
    title: 'Inset variant',
    description:
      "variant='inset' nests the main content inside a rounded card so the sidebar sits flush against the page edge.",
  },
  {
    title: 'Nested submenus',
    description: 'SidebarMenuSub + SidebarMenuSubItem render an indented child menu under a parent button.',
  },
  {
    title: 'Badges and actions',
    description: 'SidebarMenuBadge for counts and SidebarMenuAction for hover-revealed icon buttons on each row.',
  },
]
