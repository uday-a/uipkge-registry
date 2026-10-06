import type { AngularStory } from './stories'

/** Story cards for the alert-modal Angular demo (titles + descriptions mirror demos/react/alert-modal.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Default',
    description:
      'Drop in title, description, and labels — AlertModal renders an alertdialog (focus trap, no soft-dismiss, semantic role).',
  },
  {
    title: 'Destructive tone',
    description: "tone='destructive' colors the action button red and pairs with the error icon.",
  },
  {
    title: 'Tone variants',
    description: 'Built-in icon shortcuts (info / success / warning / error) and matching tone tokens.',
  },
  {
    title: 'Async action with loading',
    description: 'loading shows a spinner on the action button and disables both buttons until the promise resolves.',
  },
  {
    title: 'Controlled (no trigger)',
    description:
      'Drive open state externally — common when the modal is summoned from a menu, keyboard shortcut, or after an async event.',
  },
  {
    title: 'Slot escape hatch',
    description:
      'Slot any content into #default for inline body, or override #actions entirely for a non-default footer.',
  },
]
