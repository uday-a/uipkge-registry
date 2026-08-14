import Story from '../../components/story/Story'
import { ShipmentTrackingTimeline } from '@react-registry-blocks/shipment-tracking-timeline/ShipmentTrackingTimeline'

export default function ShipmentTrackingTimelineDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Flexport & Maersk style container freight tracking timeline with live AIS vessel telemetry, voyage ETA milestones, Reefer cold-chain specifications, and multimodal transport logistics."
      >
        <ShipmentTrackingTimeline />
      </Story>

      <Story
        title="Completed milestones filter"
        description="Tracking view pre-filtered to show historical completed journey milestones from factory loading to departure."
      >
        <ShipmentTrackingTimeline initialFilter="completed" />
      </Story>

      <Story
        title="Upcoming milestones filter"
        description="Tracking view focused on pending voyage milestones including canal transit, port berthing, and hinterland delivery."
      >
        <ShipmentTrackingTimeline initialFilter="upcoming" />
      </Story>
    </>
  )
}
