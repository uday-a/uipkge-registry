import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { ToggleGroup, ToggleGroupItem } from "../index";

function mountToggleGroup(props: Record<string, unknown> = {}) {
  return mount(ToggleGroup, {
    props: { type: "single", modelValue: "", ...props },
    attachTo: document.body,
  });
}

function mountWithItems(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { ToggleGroup, ToggleGroupItem },
      template: `
        <ToggleGroup v-bind="groupProps" v-model="val">
          <ToggleGroupItem value="a">A</ToggleGroupItem>
          <ToggleGroupItem value="b">B</ToggleGroupItem>
          <ToggleGroupItem value="c">C</ToggleGroupItem>
        </ToggleGroup>
      `,
      data() {
        return {
          val: props.modelValue ?? "",
          groupProps: { type: props.type ?? "single", ...props },
        };
      },
    },
    { attachTo: document.body },
  );
}

describe("ToggleGroup", () => {
  it('renders with data-slot="toggle-group"', () => {
    const w = mountWithItems();
    expect(w.find('[data-slot="toggle-group"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders toggle group items", () => {
    const w = mountWithItems();
    expect(w.findAll('[data-slot="toggle-group-item"]').length).toBe(3);
    w.unmount();
  });

  it("renders item slot content", () => {
    const w = mountWithItems();
    expect(w.text()).toContain("A");
    expect(w.text()).toContain("B");
    expect(w.text()).toContain("C");
    w.unmount();
  });

  it("selects item on click (single mode)", async () => {
    const w = mountWithItems({ type: "single" });
    const items = w.findAll('[data-slot="toggle-group-item"]');
    await items[0].trigger("click");
    expect((w.vm as any).val).toBe("a");
    w.unmount();
  });

  it("shows indicator for single-select", () => {
    const w = mountWithItems({ type: "single", animated: true });
    expect(w.find('[data-slot="toggle-group-indicator"]').exists()).toBe(true);
    w.unmount();
  });

  it("hides indicator when animated is false", () => {
    const w = mountWithItems({ type: "single", animated: false });
    expect(w.find('[data-slot="toggle-group-indicator"]').exists()).toBe(false);
    w.unmount();
  });

  it("applies data-size attribute", () => {
    const w = mountWithItems({ size: "lg" });
    expect(w.find('[data-slot="toggle-group"]').attributes("data-size")).toBe(
      "lg",
    );
    w.unmount();
  });

  it("applies data-variant attribute", () => {
    const w = mountWithItems({ variant: "outline" });
    expect(
      w.find('[data-slot="toggle-group"]').attributes("data-variant"),
    ).toBe("outline");
    w.unmount();
  });

  it("disables all items when group disabled is true", () => {
    const w = mountWithItems({ disabled: true });
    const items = w.findAll('[data-slot="toggle-group-item"]');
    items.forEach((item) => {
      expect(item.attributes("disabled")).toBeDefined();
    });
    w.unmount();
  });

  it("supports multiple type selection", async () => {
    const w = mountWithItems({ type: "multiple" });
    const items = w.findAll('[data-slot="toggle-group-item"]');
    await items[0].trigger("click");
    // In multiple mode, val should be an array
    const val = (w.vm as any).val;
    expect(Array.isArray(val) ? val : [val]).toContain("a");
    w.unmount();
  });
});

describe("ToggleGroupItem", () => {
  it('renders with data-slot="toggle-group-item"', () => {
    const w = mountWithItems();
    const item = w.find('[data-slot="toggle-group-item"]');
    expect(item.exists()).toBe(true);
    w.unmount();
  });

  it("shows on state when selected", async () => {
    const w = mountWithItems({ type: "single", modelValue: "a" });
    const items = w.findAll('[data-slot="toggle-group-item"]');
    expect(items[0].attributes("data-state")).toBe("on");
    w.unmount();
  });

  it("shows off state when not selected", () => {
    const w = mountWithItems({ type: "single", modelValue: "b" });
    const items = w.findAll('[data-slot="toggle-group-item"]');
    expect(items[0].attributes("data-state")).toBe("off");
    w.unmount();
  });
});
