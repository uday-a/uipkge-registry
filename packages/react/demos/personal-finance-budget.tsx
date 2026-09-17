import Story from '../../components/story/Story'
import { PersonalFinanceBudget } from '@react-registry-blocks/personal-finance-budget/PersonalFinanceBudget'

export default function PersonalFinanceBudgetDemo() {
  return (
    <Story
      title="Default"
      description="Zero-based monthly budget planner with envelope category allocation, monthly pacing cards, health indicators, and savings goals."
    >
      <PersonalFinanceBudget />
    </Story>
  )
}
