import Story from '../../components/story/Story'
import { DispatchAssignmentBoard } from '@react-registry-blocks/dispatch-assignment-board/DispatchAssignmentBoard'

export default function DispatchAssignmentBoardDemo() {
  return (
    <>
      <Story
        title="Dispatch Assignment Board"
        description="Last-mile delivery dispatch and route optimization board with live fleet overview KPIs, zone selector, payload weight load balancing, and driver route sequencing."
      >
        <DispatchAssignmentBoard />
      </Story>

      <Story title="Filtered Zone View" description="Regional dispatch view preset for San Fernando Valley Hub routes.">
        <DispatchAssignmentBoard initialZone="San Fernando Valley Hub" />
      </Story>
    </>
  )
}
