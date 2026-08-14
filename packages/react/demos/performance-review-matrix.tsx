import Story from '../../components/story/Story'
import { PerformanceReviewMatrix } from '@react-registry-blocks/performance-review-matrix/PerformanceReviewMatrix'

export default function PerformanceReviewMatrixDemo() {
  return (
    <Story
      title="Default"
      description="360-degree performance review matrix with executive metrics, consensus calibration, competency breakdown, OKR tracker, and peer feedback quotes."
    >
      <PerformanceReviewMatrix />
    </Story>
  )
}
