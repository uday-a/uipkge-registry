import type { AngularStory } from './stories'

/** Story cards for the combo-chart Angular demo (titles + descriptions mirror demos/react/combo-chart.tsx). */
export const stories: AngularStory[] = [
  {
    title: 'Orders + conversion',
    description: 'Bars on the left axis, smooth line on the right axis.',
  },
  {
    title: 'Multi-bar + line',
    description: 'Pass arrays to render grouped bars beside the trend line.',
  },
  {
    title: 'Bookings vs rate',
    description: "Air cargo dual axis: flown tonnage bars with the average $/kg line — the app's externalDataset pattern.",
  },
]
