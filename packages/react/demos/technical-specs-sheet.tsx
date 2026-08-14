'use client'

import { TechnicalSpecsSheet } from '@/components/blocks/technical-specs-sheet'
import { Story } from '../../components/story/Story'

export default function TechnicalSpecsSheetDemo() {
  return (
    <Story
      title="Technical Specifications Sheet"
      description="Laboratory-grade engineering specification sheet with Metric/Imperial toggle and searchable parameter table."
    >
      <TechnicalSpecsSheet />
    </Story>
  )
}
