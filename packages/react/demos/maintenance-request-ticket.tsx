import Story from '../../components/story/Story'
import { MaintenanceRequestTicket } from '@react-registry-blocks/maintenance-request-ticket/MaintenanceRequestTicket'

export default function MaintenanceRequestTicketDemo() {
  return (
    <>
      <Story
        title="Default Maintenance Request"
        description="Resident repair work order portal with category selection, urgency level radios, unit location, photo dropzone, and emergency hotline sidebar."
      >
        <MaintenanceRequestTicket />
      </Story>

      <Story
        title="High Emergency Priority"
        description="Work order configured with High/Emergency 2h SLA, showing the urgent response banner and immediate dispatch protocol."
      >
        <MaintenanceRequestTicket
          initialCategory="plumbing"
          initialUrgency="emergency"
          initialLocation="master_bathroom"
          initialDescription="Main water shutoff pipe under the master bathroom sink is leaking rapidly onto the hardwood flooring. Water is pooling under the cabinet."
        />
      </Story>

      <Story
        title="Call Before Entering Protocol"
        description="Work order with resident phone call appointment required prior to technician arrival."
      >
        <MaintenanceRequestTicket
          initialCategory="hvac"
          initialUrgency="routine"
          initialLocation="living_room"
          initialDescription="Annual HVAC filter inspection and thermostat schedule reprogramming request."
          initialPermission="call_first"
        />
      </Story>
    </>
  )
}
