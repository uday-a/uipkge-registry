import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'lab-results-viewer',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Quest and Labcorp style diagnostic lab results report viewer: patient metadata header, clinical attention banner, grouped test panels (Lipid, Glucose, Renal) with LOINC codes, reference range linear scale bars, historical 6-month trend deltas, and doctor clinical impression card with electronic verification.',
  files: [{ path: 'LabResultsViewer.tsx', target: 'components/blocks/LabResultsViewer.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})
