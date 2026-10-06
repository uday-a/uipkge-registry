import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description:
      "Place BorderBeam inside a relative parent — it overlays the parent and traces its border ring. Inherits the parent's radius.",
  },
  {
    title: 'Colors',
    description: 'Any CSS color works. Primary for neutral emphasis, destructive and success tokens for tone.',
  },
  {
    title: 'Slow ambient',
    description: 'duration 12 — a calm, ambient sweep that reads as background life rather than urgency.',
  },
  {
    title: 'Fast attention',
    description:
      'duration 2 — a rapid sweep that pulls the eye, useful for transient states like syncing or live activity.',
  },
  {
    title: 'Thickness',
    description: 'size controls ring thickness in px — 4px reads as a bold frame, 1px stays a hairline whisper.',
  },
  {
    title: 'Paused',
    description:
      'paused freezes the beam mid-track (animation-play-state: paused). A negative delay picks where it stops — here -3s lands it halfway around the ring.',
  },
  {
    title: 'Offset pair',
    description:
      'Negative delay offsets the starting position around the ring — delay 0 and delay -3s put two beams on opposite sides of the same layout.',
  },
  {
    title: 'AI processing',
    description: 'Classic magicui pairing — a beam around a card while a spinner communicates work in progress.',
  },
  {
    title: 'Upload progress',
    description: 'Pair the beam with a Progress bar so the whole card reads as an active transfer.',
  },
  {
    title: 'Pill',
    description: 'rounded-[inherit] means any parent shape works — here the beam wraps a fully-rounded pill badge.',
  },
  {
    title: 'Dashboard highlight',
    description: 'Draw the eye to one KPI among many — label, big number, and delta with the beam framing the tile.',
  },
]
