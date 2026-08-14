import * as React from 'react'
import Story from '../../components/story/Story'
import { MultimodalVisionPlayground } from '@react-registry-blocks/multimodal-vision-playground/MultimodalVisionPlayground'

export default function MultimodalVisionPlaygroundDemo() {
  return (
    <>
      <Story
        title="Multimodal Vision & Document Intelligence"
        description="Visual reasoning, layout parsing & entity extraction studio with bounding box highlights, OCR extraction, tabular line item parsing, and structured RFC-8259 JSON schema generation."
      >
        <MultimodalVisionPlayground />
      </Story>

      <Story
        title="Responsive Container"
        description="Compact layout testing multi-column stack and spatial canvas scaling."
      >
        <div className="mx-auto max-w-3xl">
          <MultimodalVisionPlayground />
        </div>
      </Story>
    </>
  )
}
