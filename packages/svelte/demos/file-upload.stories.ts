import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Default',
    description: 'Drop zone restricted to image files with click-to-browse fallback.',
  },
  {
    title: 'Multiple files',
    description: 'Multiple uploads with each file rendered using FileUploadItem and remove button.',
  },
  {
    title: 'Accept restriction',
    description: 'The accept prop limits the picker and renders the rule under the prompt.',
  },
  {
    title: 'Disabled',
    description: 'Pointer events and click-to-browse are suppressed; the dropzone dims to 50%.',
  },
  {
    title: 'Custom content',
    description: 'Override the default icon and prompt slots for a branded dropzone.',
  },
]
