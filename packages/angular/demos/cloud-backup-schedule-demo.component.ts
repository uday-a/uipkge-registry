import { Component, Input } from '@angular/core'
import { UiCloudBackupScheduleComponent } from '../../../../../packages/registry-angular/blocks/cloud-backup-schedule/cloud-backup-schedule.component'

/** Angular demo for the cloud-backup-schedule block page. Mirrors demos/react/cloud-backup-schedule.tsx 1:1. */
@Component({
  selector: 'angular-cloud-backup-schedule-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCloudBackupScheduleComponent],
  template: `
    @switch (story) {
      @case ('High Storage Utilization') {
        <ui-cloud-backup-schedule
          [storageUsedGb]="92.4"
          [storageTotalGb]="100"
          [retentionDays]="14"
          frequency="Every 6 hours"
        />
      }
      @case ('Manual Only Mode') {
        <ui-cloud-backup-schedule
          [initialAutoBackup]="false"
          [storageUsedGb]="34.8"
          [storageTotalGb]="250"
          [retentionDays]="90"
          frequency="On demand only"
        />
      }
      @default {
        <ui-cloud-backup-schedule />
      }
    }
  `,
})
export class AngularCloudBackupScheduleDemoComponent {
  @Input() story = 'Default Schedule'
}
