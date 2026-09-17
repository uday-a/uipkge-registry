'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface WatermarkProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Text content for the watermark. Ignored when `image` is set. */
  content?: string
  /** Image URL. When set, repeats the image instead of text. */
  image?: string
  /** Rotation angle in degrees. */
  rotate?: number
  /** Gap between repeats in pixels (both x and y). */
  gap?: number
  /** Opacity 0-1. */
  opacity?: number
  /** Font size in pixels (text only). */
  fontSize?: number
  /** Font color (text only). */
  color?: string
  /** Font family (text only). */
  fontFamily?: string
  /** Font weight (text only). */
  fontWeight?: number | string
  /** z-index of the overlay. */
  zIndex?: number
  /** When true, the overlay captures pointer events (blocks interaction). Default false (pointer-events-none). */
  interactive?: boolean
}

const Watermark = React.forwardRef<HTMLDivElement, WatermarkProps>(
  (
    {
      className,
      children,
      content = '',
      image,
      rotate = -22,
      gap = 100,
      opacity = 0.08,
      fontSize = 16,
      color = 'currentColor',
      fontFamily = 'sans-serif',
      fontWeight = 'normal',
      zIndex = 9,
      interactive = false,
      ...props
    },
    ref,
  ) => {
    const containerRef = React.useRef<HTMLDivElement | null>(null)
    const [size, setSize] = React.useState({ width: 0, height: 0 })

    React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement)

    React.useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const measure = () => {
        const rect = el.getBoundingClientRect()
        setSize({ width: rect.width, height: rect.height })
      }
      measure()
      let ro: ResizeObserver | null = null
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => measure())
        ro.observe(el)
      }
      return () => {
        ro?.disconnect()
      }
    }, [])

    // Build a tiled SVG data URL that repeats the text/image across a tile of
    // size (gap + contentSize). The SVG is then used as a background-image on
    // the overlay div, rotated to the requested angle.
    const watermarkUrl = React.useMemo(() => {
      if (!size.width || !size.height) return ''
      const text = content || ''

      if (image) {
        // For images we tile the image at its natural size within the gap.
        const tile = gap + 100
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tile}" height="${tile}" viewBox="0 0 ${tile} ${tile}">
  <image href="${image}" x="${gap / 2}" y="${gap / 2}" width="100" height="100" opacity="${opacity}" transform="rotate(${rotate} ${tile / 2} ${tile / 2})"/>
</svg>`
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
      }

      if (!text) return ''

      // Estimate text width — rough heuristic, good enough for tiling.
      const textWidth = text.length * fontSize * 0.6
      const tileW = gap + textWidth
      const tileH = gap + fontSize * 1.5

      const escapedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${tileH}" viewBox="0 0 ${tileW} ${tileH}">
  <text x="${gap / 2}" y="${gap / 2 + fontSize}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" fill="${color}" opacity="${opacity}" transform="rotate(${rotate} ${gap / 2} ${gap / 2 + fontSize / 2})">${escapedText}</text>
</svg>`
      return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
    }, [size.width, size.height, image, content, gap, fontSize, rotate, opacity, color, fontFamily, fontWeight])

    const overlayStyle: React.CSSProperties = {
      backgroundImage: watermarkUrl ? `url("${watermarkUrl}")` : undefined,
      backgroundRepeat: 'repeat',
      zIndex,
      pointerEvents: interactive ? 'auto' : 'none',
    }

    return (
      <div ref={containerRef} data-uipkge="" data-slot="watermark" className={cn('relative', className)} {...props}>
        {children}
        <div
          data-uipkge=""
          data-slot="watermark-overlay"
          className="absolute inset-0 overflow-hidden"
          style={overlayStyle}
          aria-hidden="true"
        />
      </div>
    )
  },
)
Watermark.displayName = 'Watermark'

export { Watermark }
