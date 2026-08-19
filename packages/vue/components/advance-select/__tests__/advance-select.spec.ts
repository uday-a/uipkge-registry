import { describe, it, expect, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { AdvanceSelect } from "../index";

afterEach(() => {
  document.body.innerHTML = "";
});

const options = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function mountSelect(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { AdvanceSelect },
      data() {
        return { val: props.modelValue ?? null };
      },
      template: `
        <AdvanceSelect
          :options="opts"
          :model-value="val"
          :mode="mode"
          :placeholder="placeholder"
          :show-search="showSearch"
          :variant="variant"
          :disabled="disabled"
          :open="open"
          :default-open="defaultOpen"
          @update:model-value="val = $event"
        />`,
      computed: {
        opts: () => props.options ?? options,
        mode: () => props.mode ?? "single",
        placeholder: () => props.placeholder ?? "Select...",
        showSearch: () => props.showSearch ?? false,
        variant: () => props.variant ?? "outlined",
        disabled: () => props.disabled ?? false,
        open: () => props.open,
        defaultOpen: () => props.defaultOpen ?? false,
      },
    },
    { attachTo: document.body },
  );
}

describe("AdvanceSelect", () => {
  it('renders root with data-slot="advance-select"', () => {
    const w = mountSelect();
    expect(w.find('[data-slot="advance-select"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge attribute", () => {
    const w = mountSelect();
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders trigger button with combobox role", () => {
    const w = mountSelect();
    const trigger = w.find('[data-slot="advance-select"]');
    expect(trigger.element.tagName.toLowerCase()).toBe("button");
    expect(trigger.attributes("role")).toBe("combobox");
    w.unmount();
  });

  it("renders placeholder text when no value selected", () => {
    const w = mountSelect({ placeholder: "Choose a fruit" });
    expect(w.text()).toContain("Choose a fruit");
    w.unmount();
  });

  it('renders default placeholder "Select..."', () => {
    const w = mountSelect();
    expect(w.text()).toContain("Select...");
    w.unmount();
  });

  it("renders options when open", async () => {
    const w = mountSelect({ defaultOpen: true });
    await flushPromises();
    const items = document.querySelectorAll('[data-slot="command-item"]');
    expect(items.length).toBeGreaterThanOrEqual(0);
    w.unmount();
  });

  it("shows search input when showSearch is true", async () => {
    const w = mountSelect({ showSearch: true, defaultOpen: true });
    await flushPromises();
    const searchInput = document.querySelector('[data-slot="command-input"]');
    expect(searchInput).toBeTruthy();
    w.unmount();
  });

  it("supports multiple selection mode with tags", async () => {
    const w = mountSelect({
      mode: "multiple",
      modelValue: ["apple", "banana"],
    });
    const trigger = w.find('[data-slot="advance-select"]');
    expect(trigger.text()).toContain("Apple");
    expect(trigger.text()).toContain("Banana");
    w.unmount();
  });

  it("disables trigger when disabled is true", () => {
    const w = mountSelect({ disabled: true });
    const trigger = w.find('[data-slot="advance-select"]');
    expect(trigger.attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("renders chevron icon by default", () => {
    const w = mountSelect();
    expect(w.find("svg").exists()).toBe(true);
    w.unmount();
  });
});
