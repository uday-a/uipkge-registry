import { SecurityComplianceBadges } from '@/components/blocks/security-compliance-badges'
import { Story } from '@/components/story/Story'

export default function Demo() {
  return (
    <Story title="Default" description="Enterprise security compliance workbench with interactive audit inspector">
      <div className="w-full">
        <SecurityComplianceBadges />
      </div>
    </Story>
  )
}
