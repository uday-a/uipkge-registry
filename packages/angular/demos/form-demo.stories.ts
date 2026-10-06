import type { AngularStory } from './stories'

/** Story cards for the form Angular demo (titles mirror demos/react/form.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Form Helpers',
    description:
      'FormSection, FormActions, FormStatus, and enhanced FormItem with label, required, description, help, and status.',
  },
  { title: 'Horizontal Layout', description: 'FormItem supports horizontal layout with configurable label width.' },
  {
    title: 'Login — 1 Column',
    description: 'Standard email + password with remember me. Validates with Zod via react-hook-form.',
  },
  { title: 'Login — 2 Column', description: 'Compact side-by-side layout for wider containers.' },
  { title: 'Sign Up — 1 Column', description: 'Full registration form with validation.' },
  { title: 'Sign Up — 2 Column', description: 'Two-column grid for denser layouts.' },
  { title: 'Sign Up — 3 Column', description: 'Three-column grid for maximum density.' },
  { title: 'OTP Verification', description: '6-digit code entry with resend and error states.' },
  { title: 'MFA Setup', description: 'Multi-factor authentication method selection and code entry.' },
  { title: 'Password Reset', description: 'Two-step flow: request link, then set new password.' },
  { title: 'Profile Edit — 1 Column', description: 'Single-column profile form.' },
  { title: 'Profile Edit — 2 Column', description: 'Two-column layout for profile forms.' },
  { title: 'Profile Edit — 3 Column', description: 'Three-column dense profile layout.' },
]
