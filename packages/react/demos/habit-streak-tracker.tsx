import * as React from 'react'
import Story from '../../components/story/Story'
import { HabitStreakTracker, type HabitItem } from '@react-registry-blocks/habit-streak-tracker/HabitStreakTracker'

const engineeringHabits: HabitItem[] = [
  {
    id: 'eng-1',
    title: 'Ship 1 Component to Registry',
    description: 'Author, test, and register a new UI block or primitive',
    category: 'Engineering',
    icon: 'code',
    streakDays: 45,
    completionRate: 98,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'eng-2',
    title: '2 Hours Deep Architecture Work',
    description: 'Uninterrupted focus on compiler performance and AST parsing',
    category: 'Engineering',
    icon: 'terminal',
    streakDays: 32,
    completionRate: 95,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'eng-3',
    title: 'Review 3 Pull Requests',
    description: 'Provide actionable, high-craft code review feedback',
    category: 'Engineering',
    icon: 'sparkles',
    streakDays: 28,
    completionRate: 92,
    weekHistory: [true, true, true, true, true, false, true],
  },
  {
    id: 'eng-4',
    title: 'Read RFCs & Architecture Specs',
    description: 'Study modern web specs and TC39 proposals',
    category: 'Learning',
    icon: 'book',
    streakDays: 14,
    completionRate: 88,
    weekHistory: [true, true, false, true, true, true, true],
  },
]

const healthHabits: HabitItem[] = [
  {
    id: 'hlth-1',
    title: '10,000 Steps Outdoor Walking',
    description: 'Daily cardiovascular movement and sunshine exposure',
    category: 'Health',
    icon: 'steps',
    streakDays: 60,
    completionRate: 100,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'hlth-2',
    title: 'Drink 3.0L Water Hydration',
    description: 'Consistent water intake tracked across the day',
    category: 'Health',
    icon: 'water',
    streakDays: 52,
    completionRate: 99,
    weekHistory: [true, true, true, true, true, true, true],
  },
  {
    id: 'hlth-3',
    title: '8 Hours Quality Sleep Schedule',
    description: 'Consistent sleep hygiene and early circadian rhythm',
    category: 'Health',
    icon: 'sparkles',
    streakDays: 21,
    completionRate: 90,
    weekHistory: [true, true, true, true, false, true, true],
  },
  {
    id: 'hlth-4',
    title: 'Morning 15-Min Mobility Routine',
    description: 'Joint mobility, stretching, and spine health',
    category: 'Health',
    icon: 'steps',
    streakDays: 19,
    completionRate: 94,
    weekHistory: [true, true, true, true, true, false, true],
  },
]

const earlyStageHabits: HabitItem[] = [
  {
    id: 'early-1',
    title: 'Ship 1 Component to Registry',
    description: 'Author, test, and register a new UI block or primitive',
    category: 'Engineering',
    icon: 'code',
    streakDays: 4,
    completionRate: 80,
    weekHistory: [false, false, false, true, true, true, true],
  },
  {
    id: 'early-2',
    title: 'Read 20 Pages Tech Book',
    description: 'Systems design, TypeScript craft, or CS fundamentals',
    category: 'Learning',
    icon: 'book',
    streakDays: 3,
    completionRate: 75,
    weekHistory: [false, false, true, true, true, false, true],
  },
  {
    id: 'early-3',
    title: 'Drink 2.5L Water',
    description: 'Optimal hydration tracking throughout the working day',
    category: 'Health',
    icon: 'water',
    streakDays: 4,
    completionRate: 100,
    weekHistory: [false, false, false, true, true, true, true],
  },
]

export default function HabitStreakTrackerDemo() {
  return (
    <>
      <Story
        title="Daily Habits & Consistency Matrix"
        description="GitHub-style 52-week contribution habit heatmap, flame streak counter, consistency metrics, and daily completion checklist."
      >
        <HabitStreakTracker />
      </Story>

      <Story
        title="100-Day Milestone Streak Club"
        description="Triple-digit streak milestone with high consistency baseline and pristine adherence metrics."
      >
        <HabitStreakTracker
          initialStreak={100}
          longestStreak="100 Days (Current)"
          consistencyRate={98.7}
          monthTitle="August 2026"
        />
      </Story>

      <Story
        title="Engineering & Architecture Focus"
        description="Specialized daily routine tracking tailored for senior engineers, registry authors, and system designers."
      >
        <HabitStreakTracker
          initialStreak={45}
          longestStreak="60 Days in Q1"
          consistencyRate={96.5}
          habits={engineeringHabits}
        />
      </Story>

      <Story
        title="Health & Wellness Regimen"
        description="Active wellness routines including step counts, hydration targets, and mobility tracking."
      >
        <HabitStreakTracker
          initialStreak={60}
          longestStreak="90 Days in 2025"
          consistencyRate={97.8}
          habits={healthHabits}
        />
      </Story>

      <Story
        title="Early Momentum Building"
        description="Starting a new routine cycle showing early 4-day streak progression and momentum building."
      >
        <HabitStreakTracker
          initialStreak={4}
          longestStreak="18 Days"
          consistencyRate={78.5}
          habits={earlyStageHabits}
        />
      </Story>
    </>
  )
}
