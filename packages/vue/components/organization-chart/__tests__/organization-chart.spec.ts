import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { OrganizationChart } from "../index";
import type { OrgNode } from "../types";

const data: OrgNode = {
  id: "1",
  name: "Alice Smith",
  title: "CEO",
  children: [
    { id: "2", name: "Bob Jones", title: "CTO" },
    {
      id: "3",
      name: "Carol White",
      title: "CFO",
      children: [{ id: "4", name: "Dave Brown", title: "Accountant" }],
    },
  ],
};

async function mountChart(props: Record<string, unknown> = {}) {
  const w = mount(OrganizationChart, {
    props: {
      data: props.data ?? data,
      defaultExpanded: props.defaultExpanded ?? true,
      showConnectors: props.showConnectors ?? true,
      ...props,
    },
    attachTo: document.body,
  });
  await flushPromises();
  return w;
}

describe("OrganizationChart", () => {
  it('renders container with data-slot="organization-chart"', async () => {
    const w = await mountChart();
    expect(w.find('[data-slot="organization-chart"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on container", async () => {
    const w = await mountChart();
    expect(
      w.find('[data-slot="organization-chart"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('applies data-direction="top-down" by default', async () => {
    const w = await mountChart();
    expect(
      w.find('[data-slot="organization-chart"]').attributes("data-direction"),
    ).toBe("top-down");
    w.unmount();
  });

  it("renders node names", async () => {
    const w = await mountChart();
    expect(w.text()).toContain("Alice Smith");
    expect(w.text()).toContain("Bob Jones");
    w.unmount();
  });

  it("renders connector elements when showConnectors is true", async () => {
    const w = await mountChart();
    expect(w.find(".org-v-line-down").exists()).toBe(true);
    w.unmount();
  });

  it("renders all nodes when defaultExpanded is true", async () => {
    const w = await mountChart({ defaultExpanded: true });
    expect(w.text()).toContain("Dave Brown");
    w.unmount();
  });

  it("collapses children when toggle button is clicked", async () => {
    const w = await mountChart({ defaultExpanded: true });
    expect(w.text()).toContain("Bob Jones");
    const toggleBtn = w.find('button[aria-label="Collapse"]');
    await toggleBtn.trigger("click");
    await flushPromises();
    expect(w.text()).not.toContain("Bob Jones");
    w.unmount();
  });
});
