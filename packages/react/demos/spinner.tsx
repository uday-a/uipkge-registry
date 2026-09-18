import Story from '../../components/story/Story'
import { Spinner } from '@react-registry/spinner'

export default function SpinnerDemo() {
  return (
    <>
      <Story title="Sizes" description="Use size-* and text-* utilities to scale and tint.">
        <div className="flex items-center gap-6">
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="text-primary size-8" />
          <Spinner className="size-10 text-emerald-500" />
        </div>
      </Story>

      <Story title="Inline" description="Place inside a button or label for inline loading.">
        <div className="flex items-center gap-2 text-sm">
          <Spinner className="size-4" /> Loading…
        </div>
      </Story>
    </>
  )
}
