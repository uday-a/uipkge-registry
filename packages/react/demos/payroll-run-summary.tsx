import Story from '../../components/story/Story'
import { PayrollRunSummary } from '@react-registry-blocks/payroll-run-summary/PayrollRunSummary'

export default function PayrollRunSummaryDemo() {
  return (
    <Story
      title="Default"
      description="Bi-weekly payroll execution preview, funding milestones, cost metrics, and itemized employee compensation table."
    >
      <PayrollRunSummary />
    </Story>
  )
}
