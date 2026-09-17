<script setup lang="ts">
import FlashcardStudyDeck, { type Flashcard } from '@/components/blocks/flashcard-study-deck/FlashcardStudyDeck.vue'

const frontendCards: Flashcard[] = [
  {
    id: 'ts-type-narrowing',
    category: 'TypeScript Patterns',
    difficulty: 'Engineering',
    question: 'How do Discriminated Unions enable exhaustive compile-time checking in TypeScript?',
    hint: 'Use a shared literal discriminator property (e.g. type or kind) and assert unhandled cases with the never type.',
    answer:
      'Each union member shares a common literal property. TypeScript narrows the type in each case branch; assigning unhandled branches to const _exhaustive: never ensures compile errors if new variants are added.',
    codeSnippet:
      'type Action = { type: "add"; payload: string } | { type: "reset" };\nfunction handle(a: Action) {\n  switch(a.type) {\n    case "add": return a.payload;\n    case "reset": return null;\n    default: { const _exhaustive: never = a; return _exhaustive; }\n  }\n}',
    codeLanguage: 'typescript',
    source: 'TypeScript Handbook: Discriminated Unions',
  },
  {
    id: 'web-cwv-inp',
    category: 'Core Web Vitals',
    difficulty: 'Level AA',
    question: 'What is Interaction to Next Paint (INP) and what threshold constitutes a "Good" rating?',
    hint: 'INP measures the full latency of user interactions (clicks, taps, keypresses) throughout the entire page lifecycle.',
    answer:
      'INP measures overall page responsiveness by observing the longest latency of user interactions. An INP score of ≤ 200 milliseconds is classified as Good.',
    codeSnippet: 'await scheduler.yield(); /* break long task before dispatching paint */',
    codeLanguage: 'javascript',
    source: 'web.dev / Google Chrome Core Web Vitals',
  },
  {
    id: 'vue-shallow-ref',
    category: 'Vue & Reactivity Core',
    difficulty: 'Engineering',
    question: 'When should shallowRef or triggerRef be chosen over deep reactive ref() in performance-critical apps?',
    hint: 'Think about large immutable datasets, charts, WebGL buffers, or third-party class instances.',
    answer:
      'shallowRef eliminates the proxy overhead of deeply converting nested properties. It is ideal for large datasets or third-party class instances where only the root .value assignment is tracked.',
    codeSnippet:
      'const dataset = shallowRef<BigData[]>(rawItems);\n// Replace root or trigger explicitly:\ndataset.value = [...dataset.value, newItem];',
    codeLanguage: 'typescript',
    source: 'Vue 3.5 Reactivity Guide',
  },
]
</script>

<template>
  <Story
    title="Default"
    description="Interactive spaced-repetition flashcard deck for WCAG 2.2 and Design Engineering standards with 3D flip card, hint drawer, token examples, and SM-2 interval ratings."
  >
    <FlashcardStudyDeck />
  </Story>

  <Story
    title="Frontend & TypeScript Architecture"
    description="Custom deck instance covering TypeScript discriminated unions, Core Web Vitals (INP), and Vue shallowRef memory optimization."
  >
    <FlashcardStudyDeck initial-title="Frontend Architecture & TypeScript Mastery" :initial-cards="frontendCards" />
  </Story>
</template>
