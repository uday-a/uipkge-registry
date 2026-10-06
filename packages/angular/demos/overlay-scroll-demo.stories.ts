import type { AngularStory } from './types'

export const stories: AngularStory[] = [
  {
    title: 'Default',
    description:
      'No reserved gutter — content uses the full container width. Thumb fades in on scroll or hover and fades out after 800ms of inactivity. Drag the thumb to scroll.',
  },
  {
    title: 'Sidebar nav',
    description:
      'Long vertical list inside a fixed-height nav. The thumb sits at the inner edge — useful when the content extends edge-to-edge and a reserved gutter would push items inward.',
  },
  {
    title: 'Compact file list',
    description:
      '`thumbWidth` / `thumbOffset` shrink the thumb for dense surfaces. Status pill on the left, monospace path on the right.',
  },
  {
    title: 'Programmatic scroll',
    description:
      'The component exposes its scroller element via `useImperativeHandle` — bind a ref and call `.scrollTo()` to drive scroll from outside.',
  },
  {
    title: 'Dynamic growth (infinite scroll)',
    description:
      "Rows append at runtime. The thumb shrinks and re-positions automatically because OverlayScroll wires a `ResizeObserver` on the inner element and a `MutationObserver` (`childList: true, subtree: true`) on the same node — so any DOM insertion or height change triggers thumb recalculation. Note: the registry's `virtual-list` primitive ships its own scroll container, so wrapping it in OverlayScroll would nest two scrollers. For windowed lists, use `virtual-list` directly; reach for OverlayScroll when you want overlay-style scrolling on real, dynamically-appended DOM.",
  },
  {
    title: 'Non-draggable thumb',
    description:
      "Pass `draggable={false}` to turn the thumb into a pure indicator. Wheel and trackpad still scroll; the user just can't drag the thumb itself.",
  },
]
