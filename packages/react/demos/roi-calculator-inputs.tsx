import Story from '../../components/story/Story'
import { RoiCalculatorInputs } from '@react-registry-blocks/roi-calculator-inputs/RoiCalculatorInputs'
// RoiCalculatorInputs is the block file the user installs. Open
// `components/blocks/RoiCalculatorInputs.tsx` after install to change the
// model. Showing the assumptions is what stops it reading as a toy.

export default function RoiCalculatorInputsDemo() {
  return (
    <Story
      title="ROI — Calculator"
      description="Team size, close days, and analyst rate drive a computed saving, with every assumption stated beneath the figure rather than buried."
    >
      <RoiCalculatorInputs />
    </Story>
  )
}
