import { describe, it, expect } from "vitest";
import { mountSortable, rowCount, root } from "./helpers";
import { employees } from "./fixtures";

describe("probe mount", () => {
  it("mounts DataTable and renders rows", async () => {
    const w = await mountSortable();
    expect(root(w).exists()).toBe(true);
    // default page size 10, we have 12 employees
    expect(rowCount(w)).toBe(10);
    expect(w.text()).toContain(employees[0].name);
    w.unmount();
  });
});
