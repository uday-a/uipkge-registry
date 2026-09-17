import Story from '../../components/story/Story'
import { CodeSnippetPlayground } from '@react-registry-blocks/code-snippet-playground/CodeSnippetPlayground'

export default function CodeSnippetPlaygroundDemo() {
  return (
    <Story
      title="Code Snippet Playground"
      description="Multi-file interactive code runner, editor tabs, and terminal console output. Features multi-file tab switching, syntax-highlighted dark theme editor, live interactive component preview sandbox with variant controls, and Vitest test suite console runner with keyboard shortcut (⌘↵)."
    >
      <CodeSnippetPlayground />
    </Story>
  )
}
