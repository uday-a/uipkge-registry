import Story from '../../components/story/Story'
import { LeafletLastMileCourierDispatch } from '@react-registry-blocks/leaflet-last-mile-courier-dispatch/LeafletLastMileCourierDispatch'

export default function LeafletLastMileCourierDispatchDemo() {
  return (
    <Story
      title="Default"
      description="Last-mile courier dispatch matrix on free OpenStreetMap tiles — no API key. Route progress, ETA telemetry, and POD logging."
    >
      <div className="p-4">
        <LeafletLastMileCourierDispatch />
      </div>
    </Story>
  )
}
