import Story from '../../components/story/Story'
import { QuizAssessmentRunner } from '@react-registry-blocks/quiz-assessment-runner/QuizAssessmentRunner'

const inProgressAnswers = {
  1: 'B',
  2: 'B',
}

const scoredAnswers = {
  1: 'B',
  2: 'B',
  3: 'B',
  4: 'B',
  5: 'B',
  6: 'A',
  7: 'A',
  8: 'B',
  9: 'B',
  10: 'A', // 1 incorrect for 90% Grade A score
}

export default function QuizAssessmentRunnerDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Initial quiz runner state at Question 1 with real-time countdown timer, code context snippet, and interactive question grid navigator."
      >
        <QuizAssessmentRunner />
      </Story>

      <Story
        title="In Progress (Question 3)"
        description="Assessment in progress at Question 3 with prior answers filled, question 2 flagged for review, and 30% progress."
      >
        <QuizAssessmentRunner
          initialQuestion={3}
          initialAnswers={inProgressAnswers}
          initialFlagged={[2]}
          initialTimeRemaining={984}
        />
      </Story>

      <Story
        title="Results & Score Summary"
        description="Completed certification state displaying 90% Grade A score, 4 KPI metric cards, and detailed question review explanations."
      >
        <QuizAssessmentRunner
          initialSubmitted={true}
          initialAnswers={scoredAnswers}
          initialFlagged={[2, 6]}
          initialTimeRemaining={444}
        />
      </Story>
    </>
  )
}
