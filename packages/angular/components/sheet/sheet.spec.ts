// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { create, fakeViewContainer, providing } from '../../test-utils/inject'
import {
  SHEET_OVERLAY_CLASS,
  UiSheetComponent,
  UiSheetContentComponent,
  UiSheetTitleComponent,
  sheetContentClass,
} from './sheet.component'

// Radix Dialog behaviour, as the React / Vue sheets have it: portalled over an
// overlay, page scroll locked while open, Escape and overlay clicks dismiss, focus
// moves in and is restored, and the title labels the dialog.

const tick = () => new Promise((r) => setTimeout(r, 0))

function setup() {
  const sheet = create(UiSheetComponent)
  const inj = providing(sheet)
  const content = create(
    UiSheetContentComponent,
    [
      fakeViewContainer(() => {
        const overlay = document.createElement('div')
        overlay.setAttribute('data-slot', 'sheet-overlay')
        const panel = document.createElement('div')
        panel.setAttribute('data-slot', 'sheet-content')
        panel.tabIndex = -1
        panel.innerHTML = '<button id="first">first</button>'
        return [overlay, panel]
      }),
    ],
    inj,
  )
  const opener = document.body.appendChild(document.createElement('button'))
  return { sheet, content, inj, opener }
}
const panel = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [data-slot="sheet-content"]')

describe('Sheet (angular, 14 checks)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('1: each side keeps its Vue / React edge + slide classes', () => {
    expect(sheetContentClass('right')).toContain('right-0')
    expect(sheetContentClass('left')).toContain('slide-in-from-left')
    expect(sheetContentClass('top')).toContain('inset-x-0 top-0')
    expect(sheetContentClass('bottom')).toContain('bottom-0')
  })
  it('2: overlay classes match the React overlay', () => {
    expect(SHEET_OVERLAY_CLASS).toContain('bg-foreground/50 fixed inset-0 z-50')
  })
  it('3: opening portals overlay + dialog to <body> and locks page scroll', () => {
    const { sheet } = setup()
    sheet.setOpen(true)
    expect(panel()?.closest('[data-uipkge-portal]')?.parentElement).toBe(document.body)
    expect(document.querySelector('[data-uipkge-portal] [data-slot="sheet-overlay"]')).not.toBeNull()
    expect(document.body.style.overflow).toBe('hidden')
  })
  it('4: focus moves to the first focusable inside the dialog', async () => {
    const { sheet } = setup()
    sheet.setOpen(true)
    await tick()
    expect(document.activeElement?.id).toBe('first')
  })
  it('5: Escape closes, unlocks scroll and emits closed', async () => {
    const { sheet, content } = setup()
    let closed = 0
    content.closed.subscribe(() => closed++)
    sheet.setOpen(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(sheet.isOpen).toBe(false)
    expect(closed).toBe(1)
    expect(document.body.style.overflow).toBe('')
    await tick()
    expect(panel()).toBeNull()
  })
  it('6: pointer-down outside the dialog (the overlay) closes it', () => {
    const { sheet } = setup()
    sheet.setOpen(true)
    document.querySelector('[data-slot="sheet-overlay"]')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(sheet.isOpen).toBe(false)
  })
  it('7: pointer-down inside the dialog keeps it open', () => {
    const { sheet } = setup()
    sheet.setOpen(true)
    panel()!
      .querySelector('button')!
      .dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(sheet.isOpen).toBe(true)
  })
  it('8: focus returns to the element that opened it', async () => {
    const { sheet, opener } = setup()
    opener.focus()
    sheet.setOpen(true)
    await tick()
    sheet.setOpen(false)
    await tick()
    expect(document.activeElement).toBe(opener)
  })
  it('9: extra attributes land on the dialog (sidebar mobile passes data-mobile / data-slot)', () => {
    const { sheet, content } = setup()
    content.attributes = { 'data-mobile': 'true', 'data-slot': 'sidebar' }
    sheet.setOpen(true)
    const dialog = document.querySelector('[data-uipkge-portal] [data-mobile="true"]')
    expect(dialog?.getAttribute('data-slot')).toBe('sidebar')
  })
  it('10: the title registers its id for aria-labelledby', () => {
    const { sheet, inj } = setup()
    const title = create(UiSheetTitleComponent, [], inj)
    expect(sheet.titleId).toBe(title.id)
  })
  it('11: a non-modal sheet neither locks page scroll nor traps focus (Radix modal=false)', async () => {
    const { sheet } = setup()
    sheet.modal = false
    sheet.setOpen(true)
    await tick()
    expect(document.body.style.overflow).toBe('')
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    panel()!.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(false)
  })
  it('12: the first text input gets focus with its value selected (Radix FocusScope select)', async () => {
    const sheet = create(UiSheetComponent)
    create(
      UiSheetContentComponent,
      [
        fakeViewContainer(() => {
          const panel = document.createElement('div')
          panel.setAttribute('data-slot', 'sheet-content')
          panel.innerHTML = '<input id="name" value="Pedro Duarte" />'
          return [panel]
        }),
      ],
      providing(sheet),
    )
    sheet.setOpen(true)
    await tick()
    const input = document.activeElement as HTMLInputElement
    expect(input.id).toBe('name')
    expect([input.selectionStart, input.selectionEnd]).toEqual([0, 'Pedro Duarte'.length])
  })
  it('13: preventing escapeKeyDown keeps the sheet open (Radix cancelable)', async () => {
    const { sheet, content } = setup()
    content.escapeKeyDown.subscribe((e) => e.preventDefault())
    sheet.setOpen(true)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(sheet.isOpen).toBe(true)
    expect(panel()).not.toBeNull()
    await tick()
  })
  it('14: closeAutoFocus emits on close and preventDefault skips focus restore', async () => {
    const { sheet, content, opener } = setup()
    let autofocus = 0
    content.closeAutoFocus.subscribe((e) => {
      autofocus++
      e.preventDefault()
    })
    opener.focus()
    sheet.setOpen(true)
    await tick()
    expect(document.activeElement?.id).toBe('first')
    sheet.setOpen(false)
    await tick()
    expect(autofocus).toBe(1)
    expect(document.activeElement).not.toBe(opener)
  })
})
