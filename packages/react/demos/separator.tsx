import Story from '../../components/story/Story'
import { Separator } from '@react-registry/separator'

export default function SeparatorDemo() {
  return (
    <>
      <Story title="Horizontal" description="Default orientation. Adds a 1px line spanning the parent's width.">
        <div>
          <h4 className="text-sm leading-none font-medium">Section header</h4>
          <p className="text-muted-foreground text-sm">Helper text above the divider.</p>
          <Separator className="my-3" />
          <p className="text-sm">Content below the separator.</p>
        </div>
      </Story>

      <Story title="Vertical" description="Use orientation='vertical' inside a flex container with explicit height.">
        <div className="flex h-5 items-center gap-3 text-sm">
          <span>Blog</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Source</span>
        </div>
      </Story>
    </>
  )
}
