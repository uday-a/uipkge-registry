import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../dialog'

afterEach(cleanup)

describe('Dialog', () => {
  it('DialogTrigger renders with data-slot="dialog-trigger"', () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-trigger"]')).toBeTruthy()
  })

  it('DialogTrigger renders as a button', () => {
    const { container } = render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    )
    expect(container.querySelector('[data-slot="dialog-trigger"]')?.tagName.toLowerCase()).toBe('button')
  })

  it('DialogContent has data-slot="dialog-content" when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-content"]')).toBeTruthy()
  })

  it('DialogContent has data-uipkge', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-content"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('DialogContent has role="dialog" when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-content"]')?.getAttribute('role')).toBe('dialog')
  })

  it('DialogContent has data-state="open" when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-content"]')?.getAttribute('data-state')).toBe('open')
  })

  it('DialogContent renders close button by default', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-close"]')).toBeTruthy()
  })

  it('DialogContent hides close button when showCloseButton is false', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-close"]')).toBeNull()
  })

  it('DialogHeader renders with data-slot="dialog-header"', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-header"]')).toBeTruthy()
  })

  it('DialogFooter renders with data-slot="dialog-footer"', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-footer"]')).toBeTruthy()
  })

  it('DialogTitle renders with data-slot="dialog-title"', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-title"]')).toBeTruthy()
  })

  it('DialogDescription renders with data-slot="dialog-description"', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.querySelector('[data-slot="dialog-description"]')).toBeTruthy()
  })

  it('DialogClose renders with data-slot="dialog-close"', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>,
    )
    const closes = document.body.querySelectorAll('[data-slot="dialog-close"]')
    expect(closes.length).toBeGreaterThan(0)
  })

  it('Dialog shows title text when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>My Title</DialogTitle>
            <DialogDescription>Desc</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.textContent).toContain('My Title')
  })

  it('Dialog shows description text when open', () => {
    render(
      <Dialog defaultOpen>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>My Description</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>,
    )
    expect(document.body.textContent).toContain('My Description')
  })
})
