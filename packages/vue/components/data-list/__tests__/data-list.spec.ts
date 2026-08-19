import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { DataList, DataListItem } from "../index";

describe("DataList", () => {
  it('renders a container with data-slot="data-list"', () => {
    const w = mount(DataList, { attachTo: document.body });
    expect(w.find('[data-slot="data-list"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(DataList, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders items via default slot", () => {
    const w = mount(DataList, {
      slots: { default: '<div data-slot="data-list-item">A</div>' },
      attachTo: document.body,
    });
    expect(w.text()).toContain("A");
    w.unmount();
  });
});

describe("DataListItem", () => {
  it('renders with data-slot="data-list-item"', () => {
    const w = mount(DataListItem, { attachTo: document.body });
    expect(w.find('[data-slot="data-list-item"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(DataListItem, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders key-value pair content via slots", () => {
    const w = mount(DataListItem, {
      slots: { default: "<span>Label</span><span>Value</span>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Label");
    expect(w.text()).toContain("Value");
    w.unmount();
  });
});
