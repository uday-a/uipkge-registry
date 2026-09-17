import Story from '../../components/story/Story'
import { Label } from '@react-registry/label'
import { Input } from '@react-registry/input'

export default function LabelDemo() {
  return (
    <>
      <Story title="With input" description="Label paired with an Input via matching for/id attributes.">
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Jane Doe" />
        </div>
      </Story>

      <Story
        title="Required and invalid"
        description="Destructive-colored label with required asterisk paired with an aria-invalid input."
      >
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="email" className="text-destructive">
            Email <span aria-hidden="true">*</span>
          </Label>
          <Input id="email" type="email" aria-invalid="true" />
          <p className="text-destructive text-xs">Required field</p>
        </div>
      </Story>

      <Story title="Inline with checkbox" description="Muted label sitting next to a checkbox, linked via for/id.">
        <div className="flex max-w-sm items-center gap-2">
          <input id="agree" type="checkbox" className="accent-primary size-4" />
          <Label htmlFor="agree" className="text-muted-foreground">
            Inline label next to checkbox
          </Label>
        </div>
      </Story>
    </>
  )
}
