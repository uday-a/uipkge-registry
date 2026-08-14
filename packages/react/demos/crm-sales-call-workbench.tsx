import Story from '../../components/story/Story'
import { CrmSalesCallWorkbench } from '@react-registry-blocks/crm-sales-call-workbench/CrmSalesCallWorkbench'

export default function CrmSalesCallWorkbenchDemo() {
  return (
    <Story
      title="CRM Sales Call Workbench"
      description="Live CRM sales call console with audio waveform dialer, real-time AI live transcription, objection handling battlecards, and CRM note logger."
    >
      <CrmSalesCallWorkbench />
    </Story>
  )
}
