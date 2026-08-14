import Story from '../../components/story/Story'
import { SafeNoteCalculator } from '@react-registry-blocks/safe-note-calculator/SafeNoteCalculator'

export default function SafeNoteCalculatorDemo() {
  return (
    <Story
      title="Y Combinator Post-Money SAFE Calculator"
      description="Interactive YC Post-Money SAFE note valuation calculator to simulate founder dilution, investor conversion share price, effective discount savings, and multi-scenario Series A financing cap table outcomes."
    >
      <SafeNoteCalculator />
    </Story>
  )
}
