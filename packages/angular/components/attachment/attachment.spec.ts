import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiAttachmentComponent } from './attachment.component'
import { attachmentMediaVariants as angularMedia, attachmentVariants as angularVariants } from './attachment.variants'

const here = dirname(fileURLToPath(import.meta.url))
const shared = readFileSync(resolve(here, '../../../shared/variants/attachment.variants.ts'), 'utf8')
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/attachment/attachment.variants.ts'), 'utf8')
const angularSrc = readFileSync(resolve(here, './attachment.variants.ts'), 'utf8')

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('Attachment (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to shared canonical', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(shared))
  })
  it('2: variants file matches Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('3: component is standalone', () => {
    const src = readFileSync(resolve(here, './attachment.component.ts'), 'utf8')
    expect(src).toContain('standalone: true')
  })
  it('4: defaults mirror Vue (done / default / horizontal / file)', () => {
    const c = new UiAttachmentComponent()
    expect(c.state).toBe('done')
    expect(c.size).toBe('default')
    expect(c.orientation).toBe('horizontal')
    expect(c.media).toBe('file')
    expect(c.removable).toBe(false)
  })
  it('5: host has rounded-xl border base for default', () => {
    const c = new UiAttachmentComponent()
    expect(c.hostClass).toContain('rounded-xl')
    expect(c.hostClass).toContain('border')
  })
  it('6: sizes produce distinct output', () => {
    const out = (['default', 'sm', 'xs'] as const).map((s) => angularVariants({ size: s }))
    expect(new Set(out).size).toBe(3)
  })
  it('7: xs media maps to w-7 (matches Vue)', () => {
    expect(angularMedia({ size: 'xs' })).toContain('w-7')
  })
  it('8: busy states flag uploading/processing + error description token', () => {
    const c = new UiAttachmentComponent()
    c.state = 'uploading'
    expect(c.busy).toBe(true)
    expect(c.titleClass).toContain('animate-pulse')
    c.state = 'error'
    expect(c.descriptionClass).toContain('text-destructive/80')
  })
  it('9: custom class merges via cn()', () => {
    const c = new UiAttachmentComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot root + sub-part contracts present', () => {
    const src = readFileSync(resolve(here, './attachment.component.ts'), 'utf8')
    expect(src).toContain('"attachment"')
    expect(src).toContain('"attachment-media"')
    expect(src).toContain('"attachment-title"')
    expect(src).toContain('"attachment-remove"')
  })
})
