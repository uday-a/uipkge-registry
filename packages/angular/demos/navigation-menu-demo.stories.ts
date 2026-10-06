import type { AngularStory } from './stories'

/** Story cards for the navigation-menu Angular demo (titles + descriptions mirror demos/react/navigation-menu.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Top-level nav with two triggers, each opening a panel of grouped link items.',
  },
  {
    title: 'Three-column mega menu',
    description: 'Wide content panel split into columns with icons and descriptions for richer navigation.',
  },
  {
    title: 'Standalone link',
    description: 'NavigationMenuLink renders a single trigger-styled anchor with no popover content.',
  },
  {
    title: 'With indicator',
    description: 'NavigationMenuIndicator renders an animated arrow that follows the active trigger.',
  },
  {
    title: 'Plain link nav',
    description: 'Header nav using only NavigationMenuLink — no triggers, no popovers, just styled links.',
  },
]
