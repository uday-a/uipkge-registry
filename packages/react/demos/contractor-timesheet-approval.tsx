import Story from '../../components/story/Story'
import { ContractorTimesheetApproval } from '@react-registry-blocks/contractor-timesheet-approval/ContractorTimesheetApproval'

export default function ContractorTimesheetApprovalDemo() {
  return (
    <Story
      title="Contractor Invoices & Timesheet Approvals"
      description="Deel/Remote style international contractor invoice approval surface: 4 billing overview KPI metrics, automated GitHub PR / Figma deliverable verification badges, multi-currency conversion (USD, GBP, JPY, BRL, EUR), and itemized daily timesheet slide-over drawer."
    >
      <ContractorTimesheetApproval />
    </Story>
  )
}
