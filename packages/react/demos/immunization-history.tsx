import Story from '../../components/story/Story'
import { ImmunizationHistory } from '@react-registry-blocks/immunization-history/ImmunizationHistory'

export default function ImmunizationHistoryDemo() {
  return (
    <Story
      title="Default"
      description="Digital vaccine record passport with SMART Health Card verification, active protection summary chips, complete CDC/WHO immunization history table, and travel health advisory."
    >
      <ImmunizationHistory />
    </Story>
  )
}
