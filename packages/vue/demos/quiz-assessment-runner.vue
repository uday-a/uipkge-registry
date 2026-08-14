<script setup lang="ts">
import QuizAssessmentRunner from '@/components/blocks/quiz-assessment-runner/QuizAssessmentRunner.vue'

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
</script>

<template>
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
      :initial-question="3"
      :initial-answers="inProgressAnswers"
      :initial-flagged="[2]"
      :initial-time-remaining="984"
    />
  </Story>

  <Story
    title="Results & Score Summary"
    description="Completed certification state displaying 90% Grade A score, 4 KPI metric cards, and detailed question review explanations."
  >
    <QuizAssessmentRunner
      :initial-submitted="true"
      :initial-answers="scoredAnswers"
      :initial-flagged="[2, 6]"
      :initial-time-remaining="444"
    />
  </Story>
</template>
