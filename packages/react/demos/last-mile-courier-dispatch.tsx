import Story from '../../components/story/Story'
import { LastMileCourierDispatch } from '@react-registry-blocks/last-mile-courier-dispatch'

export default function LastMileCourierDispatchDemo() {
  return (
    <Story
      title="Default"
      description="Last-mile courier dispatch matrix with real-time route progress, ETA telemetry, and Proof of Delivery (POD) logging."
    >
      <div className="p-4">
        <LastMileCourierDispatch />
      </div>
    </Story>
  )
}
