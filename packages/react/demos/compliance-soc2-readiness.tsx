import Story from '../../components/story/Story'
import { ComplianceSoc2Readiness } from '@react-registry-blocks/compliance-soc2-readiness/ComplianceSoc2Readiness'

export default function ComplianceSoc2ReadinessDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Vanta/Drata-style SOC 2 Type II, ISO 27001, and HIPAA compliance readiness dashboard with framework selector tabs, audit readiness scorecards, 4 control pillar health bars, continuous automated evidence test tables with verified artifact badges, and auditor trust center portal controls."
      >
        <ComplianceSoc2Readiness />
      </Story>

      <Story
        title="ISO 27001 ISMS Certification"
        description="Pre-selected ISO/IEC 27001:2022 Stage 2 readiness framework view with Annex A organizational, people, physical, and technological controls."
      >
        <ComplianceSoc2Readiness defaultFramework="iso27001" />
      </Story>

      <Story
        title="HIPAA Security Rule"
        description="Healthcare and ePHI protection view assessing administrative, physical, technical safeguards and Business Associate Agreements."
      >
        <ComplianceSoc2Readiness defaultFramework="hipaa" />
      </Story>

      <Story
        title="GDPR Data Privacy"
        description="General Data Protection Regulation view evaluating data protection by design, RoPA inventories, DPAs, and breach notification SLAs."
      >
        <ComplianceSoc2Readiness defaultFramework="gdpr" />
      </Story>
    </>
  )
}
