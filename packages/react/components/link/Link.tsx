import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { linkVariants, type LinkVariants } from './link.variants'

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'color'>, LinkVariants {
  /** External URL — renders an <a> with target/rel handling. */
  href?: string
  /** Router destination — renders an <a> since there is no vue-router in React.
   *  Use asChild to render a Next.js <Link> or router-aware anchor instead. */
  to?: string | object
  as?: React.ElementType
  /** Render the child element as the link (merging props/styles) instead of
   *  emitting an <a> — the React equivalent of reka-ui's as-child. Use it to
   *  give a Next.js <Link> full link styling. */
  asChild?: boolean
  /** Open external href in a new tab. Defaults to true for http(s) hrefs. */
  external?: boolean
  /** Disabled links render without href/navigation and get aria-disabled. */
  disabled?: boolean
  /** Leading icon — the React equivalent of the Vue #left slot. */
  left?: React.ReactNode
  /** Trailing icon — the React equivalent of the Vue #right slot. */
  right?: React.ReactNode
}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      href,
      to,
      as: asProp = 'a',
      asChild = false,
      underline,
      color,
      size,
      disabled,
      external,
      left,
      right,
      children,
      onClick,
      ...props
    },
    ref,
  ) => {
    const isExternal =
      !disabled && (external !== undefined ? external : typeof href === 'string' && /^https?:\/\//.test(href))

    const resolvedHref = disabled ? undefined : ((to as string | undefined) ?? href)

    const externalAttrs = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}

    const Comp = (asChild ? Slot : asProp) as React.ElementType

    return (
      <Comp
        data-uipkge=""
        data-slot="link"
        data-underline={underline}
        data-color={color}
        data-size={size}
        data-disabled={disabled ? '' : undefined}
        href={resolvedHref}
        aria-disabled={disabled ? 'true' : undefined}
        tabIndex={disabled ? -1 : undefined}
        className={cn(
          linkVariants({ underline, color, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        ref={ref}
        {...externalAttrs}
        {...props}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            e.preventDefault()
            e.stopPropagation()
            return
          }
          onClick?.(e)
        }}
      >
        {asChild ? (
          children
        ) : (
          <>
            {left}
            {children}
            {right}
          </>
        )}
      </Comp>
    )
  },
)
Link.displayName = 'Link'

export { Link }
