import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describeBlock } from "../../../test-utils/test-render";
import { CloudBackupSchedule } from "../CloudBackupSchedule";

afterEach(() => {
  cleanup();
});

describeBlock("CloudBackupSchedule", CloudBackupSchedule, {
  expectedText: "Cloud Backup & Recovery",
});

describe("CloudBackupSchedule React features", () => {
  it("renders quota statistics and AES-256 badge", () => {
    render(
      <CloudBackupSchedule
        storageUsedGb={45}
        storageTotalGb={100}
        retentionDays={60}
      />,
    );

    expect(screen.getByText(/45 GB used/i)).toBeDefined();
    expect(screen.getByText(/100 GB total/i)).toBeDefined();
    expect(screen.getByText(/60 days \(rolling\)/i)).toBeDefined();
    expect(screen.getByText(/AES-256/i)).toBeDefined();
    expect(
      screen.getAllByText(/Daily Scheduled Snapshot/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("triggers backup state when Backup Now is clicked", () => {
    render(<CloudBackupSchedule />);
    const backupBtns = screen.getAllByRole("button", { name: /backup now/i });
    expect(backupBtns.length).toBeGreaterThan(0);

    fireEvent.click(backupBtns[0]);
    expect(screen.getByText(/snapshotting\.\.\./i)).toBeDefined();
  });
});
