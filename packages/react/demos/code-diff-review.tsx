import Story from '../../components/story/Story'
import { CodeDiffReview } from '@react-registry-blocks/code-diff-review/CodeDiffReview'
// CodeDiffReview is the block file the user installs. Open
// `components/blocks/CodeDiffReview.tsx` after install to swap the `hunk`
// array; tone drives the row colour, so no per-line classes are needed.

export default function CodeDiffReviewDemo() {
  return (
    <Story
      title="Code — Diff Review"
      description="Unified diff with added and removed lines, a file path header, a reviewer note anchored to a line, and a summary bar counting the changes."
    >
      <CodeDiffReview />
    </Story>
  )
}
