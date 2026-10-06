import type { AngularStory } from './stories'

/** Story cards for the float-label Angular demo (titles mirror demos/react/float-label.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Basic input',
    description:
      'Label floats up on focus or when a value is present. Use a single-space placeholder to keep the label centered.',
  },
  {
    title: 'Pre-filled & required',
    description: 'Label stays floated when the input has a value. Required fields show a red asterisk.',
  },
  {
    title: 'Input types',
    description: 'Floating labels work across email, number, password, and textarea inputs.',
  },
  {
    title: 'Disabled',
    description: 'The wrapper and input are both disabled — label stays floated, interaction is blocked.',
  },
  {
    title: 'Side by side',
    description: 'Two float-label inputs in a row — common in name fields and date ranges.',
  },
  {
    title: 'In context: Profile form',
    description: 'A realistic edit-profile card with multiple float-label fields and a save button.',
  },
]
