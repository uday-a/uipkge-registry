import Story from '../../components/story/Story'
import { DriverInspectionChecklist } from '@react-registry-blocks/driver-inspection-checklist/DriverInspectionChecklist'

export default function DriverInspectionChecklistDemo() {
  return (
    <>
      <Story
        title="Default (Pre-Trip Inspection)"
        description="FMCSA-compliant commercial vehicle Driver Vehicle Inspection Report (DVIR) starting in pre-trip inspection mode."
      >
        <DriverInspectionChecklist />
      </Story>

      <Story
        title="With Detected Defects"
        description="Active defect log state showing failed air lines and low tire pressure with Out-of-Service severity selector and photo evidence dropzone."
      >
        <DriverInspectionChecklist initialDefectState={true} />
      </Story>

      <Story
        title="Submitted & Certified Receipt"
        description="Post-submission electronic compliance receipt with cryptographic driver CDL signature and dispatch transmission status."
      >
        <DriverInspectionChecklist initialSubmitted={true} />
      </Story>

      <Story
        title="Post-Trip Inspection Mode"
        description="End-of-shift post-trip audit for linehaul tractor and 53-ft dry van trailer."
      >
        <DriverInspectionChecklist
          initialInspectionType="post-trip"
          vehicleId="Truck #218 · Volvo VNL 860"
          trailerId="Trailer #TR-5509 (53' Reefer)"
          odometer="288,410 miles"
        />
      </Story>
    </>
  )
}
