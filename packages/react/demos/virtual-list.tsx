import Story from '../../components/story/Story'
import { useRef } from 'react'
import { Button } from '@react-registry/button'
import { VirtualList, type VirtualListHandle } from '@react-registry/virtual-list'

const fixed = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Row ${i + 1}`,
}))

const dynamic = Array.from({ length: 5000 }, (_, i) => {
  const size = 32 + (i % 7) * 12
  return { id: i, name: `Row ${i + 1} (h=${size})`, size }
})

const horizontal = Array.from({ length: 2000 }, (_, i) => ({ id: i, name: `Col ${i + 1}` }))

export default function VirtualListDemo() {
  const listRef = useRef<VirtualListHandle>(null)

  function jumpTo(i: number) {
    listRef.current?.scrollToIndex(i, { align: 'center' })
  }

  return (
    <>
      <Story
        title="Fixed size, 10k rows"
        description="Each row is exactly 40px tall. Renders only the visible window plus overscan."
      >
        <VirtualList items={fixed} itemSize={40} height={400} className="rounded-md border">
          {(item) => <div className="flex h-10 items-center border-b px-4 text-sm">{item.name}</div>}
        </VirtualList>
      </Story>

      <Story title="Dynamic size" description="itemSize as a function returns per-item heights from the data.">
        <VirtualList items={dynamic} itemSize={(item) => item.size} height={400} className="rounded-md border">
          {(item) => (
            <div className="flex items-center border-b px-4 text-sm" style={{ height: item.size + 'px' }}>
              {item.name}
            </div>
          )}
        </VirtualList>
      </Story>

      <Story
        title="Imperative scrollToIndex"
        description="Use a template ref to jump to any index, with align options."
      >
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button size="sm" onClick={() => jumpTo(0)}>
              Top
            </Button>
            <Button size="sm" onClick={() => jumpTo(2500)}>
              2500
            </Button>
            <Button size="sm" onClick={() => jumpTo(7500)}>
              7500
            </Button>
            <Button size="sm" onClick={() => jumpTo(9999)}>
              End
            </Button>
          </div>
          <VirtualList ref={listRef} items={fixed} itemSize={32} height={320} className="rounded-md border">
            {(item, index) => (
              <div className="flex h-8 items-center border-b px-4 text-xs">
                <span className="text-muted-foreground w-12">{index}</span>
                {item.name}
              </div>
            )}
          </VirtualList>
        </div>
      </Story>

      <Story title="Horizontal" description="direction='horizontal' switches to a horizontal viewport.">
        <VirtualList items={horizontal} itemSize={80} height={120} direction="horizontal" className="rounded-md border">
          {(item) => <div className="flex h-full w-20 items-center justify-center border-r text-xs">{item.name}</div>}
        </VirtualList>
      </Story>
    </>
  )
}
