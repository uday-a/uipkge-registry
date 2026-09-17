import Story from '../../components/story/Story'
import { TaxSummaryReport } from '@react-registry-blocks/tax-summary-report/TaxSummaryReport'

export default function TaxSummaryReportDemo() {
  return (
    <Story
      title="Default"
      description="Quarterly estimated tax calculator, deductions breakdown, jurisdictional liability, and quarterly filing schedule."
    >
      <TaxSummaryReport />
    </Story>
  )
}
