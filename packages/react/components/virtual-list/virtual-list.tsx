'use client'

import * as React from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { cn } from '@/lib/utils'

export interface VirtualListHandle {
  scrollToOffset: (px: number) => void
  scrollToIndex: (index: number, options?: { align?: 'start' | 'center' | 'end' }) => void
  getVisibleRange: () => [number, number]
}

export interface VirtualListProps<T> {
  items: T[]
  /** Fixed pixel size, or a measurer called per item/index. */
  itemSize: number | ((item: T, index: number) => number)
  height: number | string
  overscan?: number
  keyField?: keyof T | string
  direction?: 'vertical' | 'horizontal'
  className?: string
  /** Render-prop for each row. */
  children: (item: T, index: number) => React.ReactNode
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void
  onRangeChange?: (range: [number, number]) => void
}

function VirtualListInner<T extends Record<string, any>>(
  {
    items,
    itemSize,
    height,
    overscan = 3,
    keyField = 'id',
    direction = 'vertical',
    className,
    children,
    onScroll,
    onRangeChange,
  }: VirtualListProps<T>,
  ref: React.Ref<VirtualListHandle>,
) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const isVertical = direction === 'vertical'

  const numericHeight = typeof height === 'number' ? height : Number.parseInt(String(height), 10) || 200

  const virtualizer = useVirtualizer({
    count: items.length,
    horizontal: !isVertical,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) => (typeof itemSize === 'function' ? itemSize(items[index]!, index) : itemSize),
    overscan,
    initialRect: { width: numericHeight, height: numericHeight },
    getItemKey: (index) => {
      const item = items[index]
      const k = item?.[keyField as keyof T]
      return (k ?? index) as string | number
    },
  })

  const virtualItems = virtualizer.getVirtualItems()
  const totalSize = virtualizer.getTotalSize()

  React.useEffect(() => {
    if (!onRangeChange || virtualItems.length === 0) return
    onRangeChange([virtualItems[0]!.index, virtualItems[virtualItems.length - 1]!.index + 1])
  }, [virtualItems, onRangeChange])

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToOffset: (px) => virtualizer.scrollToOffset(px),
      scrollToIndex: (index, options) => virtualizer.scrollToIndex(index, { align: options?.align ?? 'start' }),
      getVisibleRange: () => {
        const v = virtualizer.getVirtualItems()
        if (v.length === 0) return [0, 0]
        return [v[0]!.index, v[v.length - 1]!.index + 1]
      },
    }),
    [virtualizer],
  )

  const h = typeof height === 'number' ? `${height}px` : height
  const containerStyle: React.CSSProperties = isVertical
    ? { height: h, overflowY: 'auto' }
    : { width: h, overflowX: 'auto' }

  const innerStyle: React.CSSProperties = isVertical
    ? { height: `${totalSize}px`, position: 'relative', width: '100%' }
    : { width: `${totalSize}px`, position: 'relative', height: '100%' }

  return (
    <div
      ref={scrollRef}
      data-uipkge=""
      data-slot="virtual-list"
      className={cn('w-full', className)}
      style={containerStyle}
      onScroll={onScroll}
    >
      <div style={innerStyle}>
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index]!
          const rowStyle: React.CSSProperties = isVertical
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }
            : {
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${virtualItem.size}px`,
                transform: `translateX(${virtualItem.start}px)`,
              }
          return (
            <div key={virtualItem.key} style={rowStyle}>
              {children(item, virtualItem.index)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const VirtualList = React.forwardRef(VirtualListInner) as <T extends Record<string, any>>(
  props: VirtualListProps<T> & { ref?: React.Ref<VirtualListHandle> },
) => React.ReactElement

export { VirtualList }
