import type { SvelteStory } from '../../lib/svelte-stories'

export const stories: SvelteStory[] = [
  {
    title: 'Form Helpers',
    description:
      'FormSection, FormActions, FormStatus, and enhanced FormItem with label, required, description, help, and status.',
  },
  {
    title: 'Horizontal Layout',
    description: 'FormItem supports horizontal layout with configurable label width.',
  },
  {
    title: 'Login — 1 Column',
    description: 'Standard email + password with remember me. Validates with Zod via TanStack Svelte Form.',
  },
  { title: 'Sign Up — 1 Column', description: 'Full registration form with validation.' },
  { title: 'Profile Edit — 1 Column', description: 'Single-column profile form.' },
]
