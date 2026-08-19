import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  VerticalTabs,
  VerticalTabsList,
  VerticalTabsTrigger,
  VerticalTabsContent,
} from "../index";

function mountVerticalTabs(overrides: Record<string, unknown> = {}) {
  return mount(
    {
      components: {
        VerticalTabs,
        VerticalTabsList,
        VerticalTabsTrigger,
        VerticalTabsContent,
      },
      template:
        '<VerticalTabs :default-value="val"><VerticalTabsList><VerticalTabsTrigger value="tab1">Tab 1</VerticalTabsTrigger><VerticalTabsTrigger value="tab2">Tab 2</VerticalTabsTrigger></VerticalTabsList><VerticalTabsContent value="tab1">Content 1</VerticalTabsContent><VerticalTabsContent value="tab2">Content 2</VerticalTabsContent></VerticalTabs>',
      data() {
        return { val: overrides.defaultValue ?? "tab1" };
      },
    },
    { attachTo: document.body },
  );
}

describe("VerticalTabs", () => {
  it('renders root with data-slot="vertical-tabs"', () => {
    const w = mountVerticalTabs();
    expect(w.find('[data-slot="vertical-tabs"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on root", () => {
    const w = mountVerticalTabs();
    expect(
      w.find('[data-slot="vertical-tabs"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('applies data-orientation="vertical" on root', () => {
    const w = mountVerticalTabs();
    expect(
      w.find('[data-slot="vertical-tabs"]').attributes("data-orientation"),
    ).toBe("vertical");
    w.unmount();
  });

  it('VerticalTabsList renders with data-slot="vertical-tabs-list"', () => {
    const w = mountVerticalTabs();
    expect(w.find('[data-slot="vertical-tabs-list"]').exists()).toBe(true);
    w.unmount();
  });

  it("VerticalTabsList has data-uipkge", () => {
    const w = mountVerticalTabs();
    expect(
      w.find('[data-slot="vertical-tabs-list"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('VerticalTabsTrigger renders with data-slot="vertical-tabs-trigger"', () => {
    const w = mountVerticalTabs();
    expect(w.findAll('[data-slot="vertical-tabs-trigger"]').length).toBe(2);
    w.unmount();
  });

  it("VerticalTabsTrigger has data-uipkge", () => {
    const w = mountVerticalTabs();
    expect(
      w.find('[data-slot="vertical-tabs-trigger"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('VerticalTabsContent renders with data-slot="vertical-tabs-content"', () => {
    const w = mountVerticalTabs();
    expect(w.findAll('[data-slot="vertical-tabs-content"]').length).toBe(2);
    w.unmount();
  });

  it('active trigger has data-state="active"', () => {
    const w = mountVerticalTabs({ defaultValue: "tab1" });
    const triggers = w.findAll('[data-slot="vertical-tabs-trigger"]');
    expect(triggers[0].attributes("data-state")).toBe("active");
    w.unmount();
  });

  it("renders active content text", () => {
    const w = mountVerticalTabs({ defaultValue: "tab1" });
    const contents = w.findAll('[data-slot="vertical-tabs-content"]');
    expect(contents[0].text()).toContain("Content 1");
    w.unmount();
  });
});
