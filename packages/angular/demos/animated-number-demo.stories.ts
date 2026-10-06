import type { AngularStory } from './stories'

/** Story cards for the animated-number Angular demo (titles mirror demos/react/animated-number.tsx). */
export const stories: AngularStory[] = [
  { title: 'Default', description: 'Integer count-up from zero on load.' },
  { title: 'Currency', description: 'Formatted with Intl.NumberFormat USD.' },
  { title: 'Percentage', description: 'One decimal place via Intl percent style.' },
  { title: 'Compact notation', description: 'Large numbers collapse to 1.2K / 3.4M style.' },
  { title: 'Fast vs slow', description: '300ms vs 2400ms side by side — pick a duration that matches the moment.' },
  {
    title: 'Live ticker',
    description: 'Value drifts every two seconds; the tween retargets from the displayed value.',
  },
  { title: 'KPI delta', description: 'Negative renders red with a down arrow, positive green with an up arrow.' },
  { title: 'Tabular column', description: 'tabular-nums keeps a column of changing figures aligned.' },
  { title: 'Staggered trio', description: 'Delay 0 / 150 / 300ms for a cascading count-up.' },
  { title: 'Disabled', description: 'disabled renders the target instantly — useful above the fold or in print.' },
  { title: 'Retargeting', description: 'Buttons jump the target mid-animation; the tween eases from wherever it is.' },
  { title: 'Locale', description: 'de-DE grouping — formatters are just functions.' },
]
