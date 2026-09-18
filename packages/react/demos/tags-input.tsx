import Story from '../../components/story/Story'
import { useState } from 'react'
import { Label } from '@react-registry/label'
import { TagsInput } from '@react-registry/tags-input'

// The React TagsInput is a single component (no TagsInputItem/Input sub-parts —
// chips + input are rendered internally). It exposes value/onValueChange,
// placeholder, disabled, addOnKeys, addOnPaste, delimiter, unique, and max.
export default function TagsInputDemo() {
  const [tags, setTags] = useState(['react', 'next', 'tailwind'])
  const [pasteTags, setPasteTags] = useState<string[]>([])
  const [csvTags, setCsvTags] = useState<string[]>(['design', 'systems'])
  const [maxTags, setMaxTags] = useState<string[]>(['alpha', 'beta'])
  const [lockedTags] = useState(['read-only', 'locked'])

  return (
    <>
      <Story title="Default" description="Free-text input that converts entries into removable tag chips.">
        <div className="max-w-md space-y-2">
          <Label>Tags</Label>
          <TagsInput value={tags} onValueChange={setTags} placeholder="Add a tag..." />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{tags.join(', ') || '—'}</code>
          </p>
        </div>
      </Story>

      <Story title="Add on paste" description="Pasting splits on whitespace and adds each token as a tag.">
        <div className="max-w-md space-y-2">
          <Label>Paste a list</Label>
          <TagsInput
            value={pasteTags}
            onValueChange={setPasteTags}
            addOnPaste
            placeholder="Try pasting: red green blue"
          />
        </div>
      </Story>

      <Story title="Custom delimiter" description="Use the delimiter prop to split on commas instead of Enter.">
        <div className="max-w-md space-y-2">
          <Label>Comma-separated tags</Label>
          <TagsInput value={csvTags} onValueChange={setCsvTags} delimiter="," placeholder="Type and press comma..." />
        </div>
      </Story>

      <Story title="Max length" description="Cap the total number of tags via the max prop.">
        <div className="max-w-md space-y-2">
          <Label>Up to 3 tags</Label>
          <TagsInput value={maxTags} onValueChange={setMaxTags} max={3} placeholder="Add another..." />
          <p className="text-muted-foreground text-xs">{maxTags.length} / 3 tags</p>
        </div>
      </Story>

      <Story title="Disabled" description="Disabled state hides the input and prevents tag removal.">
        <div className="max-w-md space-y-2">
          <Label>Locked tags</Label>
          <TagsInput value={lockedTags} disabled placeholder="Cannot edit" />
        </div>
      </Story>
    </>
  )
}
