import type { AngularStory } from './stories'

export const stories: AngularStory[] = [
  {
    title: 'Default',
    description: 'Code block with a short Vue snippet and default settings. Line numbers and Copy button are on.',
  },
  {
    title: 'Without line numbers',
    description: 'Drop line numbers for short snippets or when the block is embedded in prose.',
  },
  {
    title: 'Shell / bash',
    description:
      "Set language='bash' (or 'shell') to render command snippets. Copy button stays the same regardless of language.",
  },
  {
    title: 'TypeScript',
    description:
      'Same renderer, different language label. Pair with a filename heading or surrounding doc when you need more context.',
  },
  {
    title: 'Longer snippet',
    description:
      "Line numbers earn their keep at 15+ line snippets — readers can reference 'line 9' in code review or docs without ambiguity.",
  },
]
