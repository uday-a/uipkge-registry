import Story from '../../components/story/Story'
import { useState } from 'react'
import { Transfer, type TransferItem } from '@react-registry/transfer'

const data: TransferItem[] = Array.from({ length: 15 }, (_, i) => ({
  key: `k-${i + 1}`,
  label: `Item ${i + 1}`,
  description: i % 3 === 0 ? `Group A` : `Group B`,
  disabled: i === 2,
}))

const big: TransferItem[] = Array.from({ length: 200 }, (_, i) => ({
  key: `big-${i}`,
  label: `Record ${i + 1}`,
}))

export default function TransferDemo() {
  const [target1, setTarget1] = useState<string[]>([])
  const [target2, setTarget2] = useState<string[]>(['k-5', 'k-7'])
  const [target3, setTarget3] = useState<string[]>([])
  const [target4, setTarget4] = useState<string[]>([])
  const [target5, setTarget5] = useState<string[]>([])
  const [target6, setTarget6] = useState<string[]>(['k-1', 'k-4', 'k-6'])
  const [target7, setTarget7] = useState<string[]>([])

  return (
    <>
      <Story title="Basic" description="Pick from the source, click the right arrow to move.">
        <Transfer targetKeys={target1} onTargetKeysChange={setTarget1} dataSource={data} />
      </Story>

      <Story title="With search" description="Search input filters each side independently.">
        <Transfer targetKeys={target2} onTargetKeysChange={setTarget2} dataSource={data} showSearch />
      </Story>

      <Story title="With pagination" description="pagination=true uses page size 10. Pass {pageSize} to override.">
        <Transfer
          targetKeys={target3}
          onTargetKeysChange={setTarget3}
          dataSource={big}
          pagination={{ pageSize: 8 }}
          showSearch
        />
      </Story>

      <Story title="One-way" description="oneWay hides the right-to-left button.">
        <Transfer targetKeys={target4} onTargetKeysChange={setTarget4} dataSource={data} oneWay />
      </Story>

      <Story
        title="Drag and drop"
        description="draggable enables HTML5 drag between lists and reordering inside the target. Drag a selected row to drag the whole selection."
      >
        <Transfer targetKeys={target6} onTargetKeysChange={setTarget6} dataSource={data} draggable showSearch />
      </Story>

      <Story
        title="Selectable=false (no checkboxes)"
        description="Hides checkboxes; row click uses desktop pattern — plain=replace, cmd/ctrl+click=toggle, shift+click=range. Combine with draggable for pure drag UX."
      >
        <Transfer targetKeys={target7} onTargetKeysChange={setTarget7} dataSource={data} selectable={false} draggable />
      </Story>

      <Story
        title="Custom titles + footer"
        description="titles prop labels each side; footer slots add per-side actions."
      >
        <Transfer
          targetKeys={target5}
          onTargetKeysChange={setTarget5}
          dataSource={data}
          titles={['Available', 'Selected']}
          footerLeft={<span className="text-muted-foreground text-xs">Tip: enable `draggable` for DnD.</span>}
        />
      </Story>
    </>
  )
}
