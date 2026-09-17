import Story from '../../components/story/Story'
import { DoctorAppointmentScheduler } from '@react-registry-blocks/doctor-appointment-scheduler/DoctorAppointmentScheduler'

export default function DoctorAppointmentSchedulerDemo() {
  return (
    <>
      <Story
        title="Default Specialist Scheduler"
        description="Zocdoc and Epic style doctor appointment booking calendar with physician profile, visit type selection, date carousel, morning and afternoon slots, live copay estimation, and booking confirmation."
      >
        <DoctorAppointmentScheduler />
      </Story>

      <Story
        title="Cardiology Clinic"
        description="Configured with custom clinic name, specialized doctor profile, and pre-selected telehealth visit mode."
      >
        <DoctorAppointmentScheduler
          doctorName="Dr. Marcus Thorne, MD, FACC"
          doctorTitle="Chief of Clinical Cardiology · Cedars-Sinai Heart Institute"
          specialty="Interventional Cardiology"
          clinicName="Cedars-Sinai Medical Plaza"
          clinicAddress="8700 Beverly Blvd, Suite 400, Los Angeles, CA 90048"
          initialVisitType="telehealth"
          initialDate="2026-08-28"
          initialTime="02:45 PM"
          initialReason="annual-checkup"
        />
      </Story>
    </>
  )
}
