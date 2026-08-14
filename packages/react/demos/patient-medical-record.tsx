import Story from '../../components/story/Story'
import { PatientMedicalRecord } from '@react-registry-blocks/patient-medical-record/PatientMedicalRecord'

export default function PatientMedicalRecordDemo() {
  return (
    <Story
      title="Default"
      description="Epic/Cerner-style EHR patient chart and clinical summary with vitals, problem list, medications, clinical notes, and care team."
    >
      <PatientMedicalRecord />
    </Story>
  )
}
