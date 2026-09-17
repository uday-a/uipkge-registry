import Story from "../../components/story/Story";
import { CloudBackupSchedule } from "@/components/blocks/cloud-backup-schedule/CloudBackupSchedule";

export default function CloudBackupScheduleDemo() {
  return (
    <>
      <Story
        title="Default Schedule"
        description="Automated daily backup schedule with vault quota gauge and AES-256 encryption status."
      >
        <CloudBackupSchedule />
      </Story>

      <Story
        title="High Storage Utilization"
        description="Backup scheduler showing near-capacity storage quota requiring retention adjustment."
      >
        <CloudBackupSchedule
          storageUsedGb={92.4}
          storageTotalGb={100}
          retentionDays={14}
          frequency="Every 6 hours"
        />
      </Story>

      <Story
        title="Manual Only Mode"
        description="Daily automation disabled with long-term retention policy for enterprise archiving."
      >
        <CloudBackupSchedule
          initialAutoBackup={false}
          storageUsedGb={34.8}
          storageTotalGb={250}
          retentionDays={90}
          frequency="On demand only"
        />
      </Story>
    </>
  );
}
