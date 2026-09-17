import { FeatureMatrixTableDense } from '@/components/blocks/feature-matrix-table-dense'
import { Story } from '@/components/story/Story'

export default function FeatureMatrixTableDenseDemo() {
  return (
    <Story
      title="Default"
      description="Dense technical architecture specification matrix with collapsible sections and search."
    >
      <FeatureMatrixTableDense />
    </Story>
  )
}
