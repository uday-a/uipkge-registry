// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { TestBed } from '@angular/core/testing'
import { UiCloudBackupScheduleComponent } from './cloud-backup-schedule.component'

// CloudBackupSchedule is the React block 1:1. If these break, operators see the wrong quota
// percentage, a toggle that does not reflect the configured schedule, or a manual backup that
// never lands in the snapshot ledger.

function render(inputs: Partial<Record<string, unknown>> = {}) {
  const fixture = TestBed.createComponent(UiCloudBackupScheduleComponent)
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v)
  fixture.detectChanges()
  const host = fixture.nativeElement as HTMLElement
  const text = () => host.textContent!.replace(/\s+/g, ' ')
  const rows = () => [...host.querySelectorAll<HTMLElement>('.divide-y > div')]
  const button = () => host.querySelector<HTMLButtonElement>('button[data-slot="button"]')!
  const sw = () => host.querySelector<HTMLButtonElement>('button[role="switch"]')!
  return { fixture, host, text, rows, button, sw }
}

afterEach(() => vi.useRealTimers())

describe('CloudBackupSchedule (angular block parity, 5 checks)', () => {
  it('1: renders the React copy and default schedule details', () => {
    const { text } = render()
    for (const t of [
      'Cloud Backup & Recovery',
      'AES-256',
      'Window:Everyday at 02:00 UTC',
      'Retention:30 days (rolling)',
      'Target:AWS S3 (us-east-1)',
      '68% used',
      '68.4 GB used',
      '100 GB total',
      'Last verified: 12 minutes ago',
      'Next scheduled backup: Tonight at 02:00 UTC',
      'Disaster recovery runbook',
    ])
      expect(text()).toContain(t)
  })

  it('2: ledger lists the four seeded snapshots with status badges', () => {
    const { rows } = render()
    expect(rows()).toHaveLength(4)
    const badges = rows().map((r) => r.querySelector('[data-slot="badge"]')!.textContent!.trim())
    expect(badges).toEqual(['completed', 'completed', 'completed', 'failed'])
    expect(rows()[3]!.querySelector('[data-slot="badge"]')!.className).toContain('bg-destructive')
    expect(rows()[0]!.textContent).toContain('(snap-9842)')
  })

  it('3: quota and retention follow the inputs (High Storage story)', () => {
    const { text, host } = render({
      storageUsedGb: 92.4,
      storageTotalGb: 100,
      retentionDays: 14,
      frequency: 'Every 6 hours',
    })
    expect(text()).toContain('92% used')
    expect(text()).toContain('14 days (rolling)')
    expect(text()).toContain('Every 6 hours')
    expect(host.querySelector('[data-slot="progress"]')!.getAttribute('aria-valuenow')).toBe('92')
  })

  it('4: the automation switch starts from initialAutoBackup and toggles', () => {
    const on = render()
    expect(on.sw().getAttribute('aria-checked')).toBe('true')
    TestBed.resetTestingModule()
    const off = render({ initialAutoBackup: false })
    expect(off.sw().getAttribute('aria-checked')).toBe('false')
    off.sw().click()
    off.fixture.detectChanges()
    expect(off.sw().getAttribute('aria-checked')).toBe('true')
  })

  it('5: Backup Now disables while snapshotting, then prepends a manual snapshot', () => {
    vi.useFakeTimers()
    const { fixture, button, rows, text } = render()
    button().click()
    fixture.detectChanges()
    expect(button().disabled).toBe(true)
    expect(text()).toContain('Snapshotting...')
    vi.advanceTimersByTime(1200)
    fixture.detectChanges()
    expect(button().disabled).toBe(false)
    expect(text()).toContain('Backup Now')
    expect(text()).toContain('Last verified: Just now')
    expect(rows()).toHaveLength(5)
    expect(rows()[0]!.textContent).toContain('Manual On-demand Snapshot')
  })
})
