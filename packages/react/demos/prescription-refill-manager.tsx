import Story from '../../components/story/Story'
import { PrescriptionRefillManager } from '@react-registry-blocks/prescription-refill-manager/PrescriptionRefillManager'

export default function PrescriptionRefillManagerDemo() {
  return (
    <Story
      title="Default"
      description="Pharmacy patient portal for managing active prescriptions, refill requests, dosage schedules, delivery tracking, and preferred pharmacy details with an integrated refill order dialog."
    >
      <PrescriptionRefillManager />
    </Story>
  )
}
