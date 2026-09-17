import Story from '../../components/story/Story'
import { BenefitsEnrollmentPortal } from '@react-registry-blocks/benefits-enrollment-portal/BenefitsEnrollmentPortal'

export default function BenefitsEnrollmentPortalDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Standard benefits open enrollment portal for Elena Rostova (Employee + Spouse tier) with BlueCross PPO + HSA, Delta Dental Premier, VSP Choice Plus, and 6% 401(k) contribution unlocking the full $6,000 employer match."
      >
        <BenefitsEnrollmentPortal />
      </Story>

      <Story
        title="Family Coverage Tier & Higher Deferral"
        description="Family enrollment tier for Marcus Vance (Employee + Family) with BlueCross Gold Premier PPO, 10% 401(k) retirement deferral, and higher compensation bracket."
      >
        <BenefitsEnrollmentPortal
          employeeName="Marcus Vance"
          employeeId="EMP-39014"
          coverageTier="Employee + Family"
          department="Product Management · Director"
          annualSalary={165000}
          initialMedicalPlan="medical-gold-ppo"
          initialDentalPlan="dental-comprehensive"
          initialVisionPlan="vision-choice-plus"
          initial401kRate={10}
        />
      </Story>

      <Story
        title="Individual Tier & Partial 401(k) Match"
        description="Individual enrollment tier for Aisha Chen with Kaiser Permanente HMO, Delta Basic Dental, and 3% 401(k) deferral showing the missed employer match incentive callout."
      >
        <BenefitsEnrollmentPortal
          employeeName="Aisha Chen"
          employeeId="EMP-51280"
          coverageTier="Employee Only"
          department="Operations · Specialist"
          annualSalary={85000}
          initialMedicalPlan="medical-kaiser-hmo"
          initialDentalPlan="dental-basic"
          initialVisionPlan="vision-standard"
          initial401kRate={3}
          deadlineDate="Sep 15"
          daysRemaining={14}
        />
      </Story>

      <Story
        title="Urgent Deadline Window"
        description="Open enrollment portal in the final 2-day enrollment window with urgent amber status badge."
      >
        <BenefitsEnrollmentPortal
          employeeName="Liam O'Connor"
          employeeId="EMP-60412"
          coverageTier="Employee + Children"
          department="Design · Lead Staff"
          annualSalary={135000}
          deadlineDate="Tomorrow (Sep 15)"
          daysRemaining={2}
        />
      </Story>
    </>
  )
}
