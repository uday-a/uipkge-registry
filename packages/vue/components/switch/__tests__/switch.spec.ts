import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Switch from "../Switch.vue";

// Wrapper needed because Switch uses reka-ui types that the SFC compiler
// can't extract in the test environment.
function mountSwitch(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { Switch },
      data() {
        return { val: props.modelValue ?? false, ...props };
      },
      template: `
        <Switch
          :model-value="val"
          :default-value="defaultValue"
          :size="size"
          :loading="loading"
          :color="color"
          :disabled="disabled"
          :checked-children="checkedChildren"
          :un-checked-children="unCheckedChildren"
          @update:model-value="val = $event"
        />`,
      computed: {
        defaultValue: () => props.defaultValue,
        size: () => props.size,
        loading: () => props.loading,
        color: () => props.color,
        disabled: () => props.disabled,
        checkedChildren: () => props.checkedChildren,
        unCheckedChildren: () => props.unCheckedChildren,
      },
    },
    { attachTo: document.body },
  );
}

describe("Switch", () => {
  it('renders with data-slot="switch"', () => {
    const w = mountSwitch({ modelValue: false });
    expect(w.find('[data-slot="switch"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders a switch role element", () => {
    const w = mountSwitch({ modelValue: false });
    expect(w.find('[role="switch"]').exists()).toBe(true);
    w.unmount();
  });

  it("shows unchecked state when modelValue is false", () => {
    const w = mountSwitch({ modelValue: false });
    expect(w.find('[role="switch"]').attributes("data-state")).toBe(
      "unchecked",
    );
    w.unmount();
  });

  it("shows checked state when modelValue is true", () => {
    const w = mountSwitch({ modelValue: true });
    expect(w.find('[role="switch"]').attributes("data-state")).toBe("checked");
    w.unmount();
  });

  it('renders thumb with data-slot="switch-thumb"', () => {
    const w = mountSwitch({ modelValue: false });
    expect(w.find('[data-slot="switch-thumb"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("toggles when clicked", async () => {
    const w = mountSwitch({ modelValue: false });
    await w.find('[role="switch"]').trigger("click");
    expect((w.vm as any).val).toBe(true);
    w.unmount();
  });

  it("disables switch when disabled prop is true", () => {
    const w = mountSwitch({ modelValue: false, disabled: true });
    expect(w.find('[role="switch"]').attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("disables switch when loading is true", () => {
    const w = mountSwitch({ modelValue: false, loading: true });
    expect(w.find('[role="switch"]').attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("renders checked children text when checked", () => {
    const w = mountSwitch({ modelValue: true, checkedChildren: "ON" });
    expect(w.text()).toContain("ON");
    w.unmount();
  });

  it("renders unchecked children text when unchecked", () => {
    const w = mountSwitch({ modelValue: false, unCheckedChildren: "OFF" });
    expect(w.text()).toContain("OFF");
    w.unmount();
  });

  it("renders without crashing in uncontrolled mode", () => {
    const w = mount(
      {
        components: { Switch },
        template: "<Switch />",
      },
      { attachTo: document.body },
    );
    expect(w.find('[role="switch"]').exists()).toBe(true);
    w.unmount();
  });
});
