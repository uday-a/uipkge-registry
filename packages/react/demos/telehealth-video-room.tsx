import Story from '../../components/story/Story'
import { TelehealthVideoRoom } from '@react-registry-blocks/telehealth-video-room/TelehealthVideoRoom'

export default function TelehealthVideoRoomDemo() {
  return (
    <Story
      title="Telehealth Video Room"
      description="Doxy/Zoom Health style HIPAA-compliant video consultation room with encrypted video canvas, live telemetry vitals, clinical SOAP notes drawer, in-call chat, and e-prescription generator."
    >
      <TelehealthVideoRoom />
    </Story>
  )
}
