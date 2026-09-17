import { describe, it, expect, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { CascadeSelect } from "../index";
import type { CascadeOption } from "../types";

afterEach(() => {
  document.body.innerHTML = "";
});

const options: CascadeOption[] = [
  {
    value: "us",
    label: "United States",
    children: [
      {
        value: "ca",
        label: "California",
        children: [{ value: "sf", label: "San Francisco" }],
      },
      { value: "ny", label: "New York" },
    ],
  },
  {
    value: "ca-country",
    label: "Canada",
    children: [{ value: "on", label: "Ontario" }],
  },
];

function mountCascade(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { CascadeSelect },
      data() {
        return { val: props.modelValue ?? null };
      },
      template: `
        <CascadeSelect
          :options="opts"
          :model-value="val"
          :placeholder="placeholder"
          :searchable="searchable"
          :disabled="disabled"
          :open="open"
          @update:model-value="val = $event"
        />`,
      computed: {
        opts: () => props.options ?? options,
        placeholder: () => props.placeholder ?? "Select...",
        searchable: () => props.searchable ?? true,
        disabled: () => props.disabled ?? false,
        open: () => props.open,
      },
    },
    { attachTo: document.body },
  );
}

describe("CascadeSelect", () => {
  it('renders trigger with data-slot="cascade-select"', () => {
    const w = mountCascade();
    expect(w.find('[data-slot="cascade-select"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge attribute", () => {
    const w = mountCascade();
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders trigger button with combobox role", () => {
    const w = mountCascade();
    const trigger = w.find('[data-slot="cascade-select"]');
    expect(trigger.element.tagName.toLowerCase()).toBe("button");
    expect(trigger.attributes("role")).toBe("combobox");
    w.unmount();
  });

  it("renders placeholder when no value selected", () => {
    const w = mountCascade({ placeholder: "Choose location" });
    expect(w.text()).toContain("Choose location");
    w.unmount();
  });

  it("displays selected path with separator", () => {
    const w = mountCascade({ modelValue: ["us", "ca", "sf"] });
    expect(w.text()).toContain("United States / California / San Francisco");
    w.unmount();
  });

  it("renders options when open", async () => {
    const w = mountCascade({ open: true });
    await flushPromises();
    const buttons = document.querySelectorAll("button");
    expect(buttons.length).toBeGreaterThan(0);
    w.unmount();
  });

  it("renders search input when searchable and open", async () => {
    const w = mountCascade({ open: true, searchable: true });
    await flushPromises();
    const searchInput = document.querySelector(
      'input[aria-label="Search options"]',
    );
    expect(searchInput).toBeTruthy();
    w.unmount();
  });

  it("disables trigger when disabled is true", () => {
    const w = mountCascade({ disabled: true });
    const trigger = w.find('[data-slot="cascade-select"]');
    expect(trigger.attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("supports nested children options", () => {
    const w = mountCascade({ modelValue: ["us", "ny"] });
    expect(w.text()).toContain("United States / New York");
    w.unmount();
  });
});
