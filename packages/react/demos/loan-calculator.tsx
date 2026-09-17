import Story from '../../components/story/Story'
import { LoanCalculator } from '@react-registry-blocks/loan-calculator/LoanCalculator'

export default function LoanCalculatorDemo() {
  return (
    <Story
      title="Loan &amp; Mortgage Amortization Calculator"
      description="Interactive mortgage and commercial loan amortization schedule calculator with dynamic sliders, loan type presets, extra payment impact simulation, principal vs interest visual ratio bar, and year-by-year amortization breakdown table."
    >
      <LoanCalculator />
    </Story>
  )
}
