import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { describeBlock } from '../../../test-utils/test-render'
import CloudBackupSchedule from '../CloudBackupSchedule.vue'

describeBlock('CloudBackupSchedule', CloudBackupSchedule, {
  expectedText: 'Cloud Backup & Recovery',
})

describe('CloudBackupSchedule unique features', () => {
  it('renders snapshot history and storage quota', () => {
    const wrapper = mount(CloudBackupSchedule, {
      props: {
        storageUsedGb: 50,
        storageTotalGb: 100,
        retentionDays: 14,
      },
    })

    expect(wrapper.text()).toContain('50 GB consumed')
    expect(wrapper.text()).toContain('100 GB allocated')
    expect(wrapper.text()).toContain('14 days (rolling)')
    expect(wrapper.text()).toContain('Daily Scheduled Snapshot')
    expect(wrapper.text()).toContain('AES-256')
  })

  it('triggers backup action when button clicked', async () => {
    const wrapper = mount(CloudBackupSchedule)
    const backupBtn = wrapper.find('button')
    expect(backupBtn.exists()).toBe(true)
    expect(backupBtn.text()).toContain('Backup Now')

    await backupBtn.trigger('click')
    expect(backupBtn.text()).toContain('Snapshotting...')
  })
})
