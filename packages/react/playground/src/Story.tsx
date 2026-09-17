import React, { type ReactNode } from 'react'

interface StoryProps {
  title: string
  description?: string
  children: ReactNode
}

export default function Story({ title, description, children }: StoryProps) {
  return (
    <section className="my-6 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs">
      <div className="border-b border-border bg-muted/30 px-5 py-3.5 flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className="p-6 bg-background/50 flex flex-col gap-4">
        {children}
      </div>
    </section>
  )
}
