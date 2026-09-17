import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import Checkbox from "../Checkbox.vue";

// Wrapper component that passes props via template, which allows the
// SFC compiler to resolve props at the wrapper level.
function makeCheckboxWrapper(props: Record<string, unknown> = {}) {
  return defineComponent({
    components: { Checkbox },
    data() {
      return { ...props };
    },
    render() {
      return h(Checkbox as any, {
        ...this.$data,
        onUpdateModelValue: (v: any) => this.$emit("update:modelValue", v),
      });
    },
  });
}

function mountCheckbox(props: Record<string, unknown> = {}) {
  const Wrapper = defineComponent({
    components: { Checkbox },
    data() {
      return { val: props.modelValue ?? false, ...props };
    },
    template: `
      <Checkbox
        :model-value="val"
        :label="label"
        :hint="hint"
        :error-messages="errorMessages"
        :error="error"
        :disabled="disabled"
        :indeterminate="indeterminate"
        :size="size"
        :loading="loading"
        :label-position="labelPosition"
        :hide-icon="hideIcon"
        :inline="inline"
        :density="density"
        :color="color"
        :flat="flat"
        :readonly="readonly"
        :name="name"
        @update:model-value="val = $event"
      />`,
    computed: {
      label: () => props.label,
      hint: () => props.hint,
      errorMessages: () => props.errorMessages,
      error: () => props.error,
      disabled: () => props.disabled,
      indeterminate: () => props.indeterminate,
      size: () => props.size,
      loading: () => props.loading,
      labelPosition: () => props.labelPosition,
      hideIcon: () => props.hideIcon,
      inline: () => props.inline,
      density: () => props.density,
      color: () => props.color,
      flat: () => props.flat,
      readonly: () => props.readonly,
      name: () => props.name,
    },
  });
  return mount(Wrapper, { attachTo: document.body });
}

describe("Checkbox", () => {
  it('renders with data-slot="checkbox"', () => {
    const w = mountCheckbox({ modelValue: false });
    expect(w.find('[data-slot="checkbox"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on indicator when checked", () => {
    const w = mountCheckbox({ modelValue: true });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders a checkbox root element", () => {
    const w = mountCheckbox({ modelValue: false });
    expect(w.find('[role="checkbox"]').exists()).toBe(true);
    w.unmount();
  });

  it("shows checked state when modelValue is true", () => {
    const w = mountCheckbox({ modelValue: true });
    expect(w.find('[role="checkbox"]').attributes("data-state")).toBe(
      "checked",
    );
    w.unmount();
  });

  it("shows unchecked state when modelValue is false", () => {
    const w = mountCheckbox({ modelValue: false });
    expect(w.find('[role="checkbox"]').attributes("data-state")).toBe(
      "unchecked",
    );
    w.unmount();
  });

  it("emits update:modelValue when clicked", async () => {
    const w = mountCheckbox({ modelValue: false });
    const checkbox = w.find('[role="checkbox"]');
    await checkbox.trigger("click");
    // The wrapper should have updated val
    expect((w.vm as any).val).toBe(true);
    w.unmount();
  });

  it("renders label text", () => {
    const w = mountCheckbox({ modelValue: false, label: "Accept terms" });
    expect(w.text()).toContain("Accept terms");
    w.unmount();
  });

  it("renders hint text", () => {
    const w = mountCheckbox({ modelValue: false, hint: "Read carefully" });
    expect(w.text()).toContain("Read carefully");
    w.unmount();
  });

  it("renders error messages", () => {
    const w = mountCheckbox({ modelValue: false, errorMessages: "Required" });
    expect(w.text()).toContain("Required");
    w.unmount();
  });

  it("shows indeterminate state when indeterminate prop is true", () => {
    const w = mountCheckbox({ indeterminate: true });
    expect(w.find('[role="checkbox"]').attributes("data-state")).toBe(
      "indeterminate",
    );
    w.unmount();
  });

  it("disables checkbox when disabled prop is true", () => {
    const w = mountCheckbox({ modelValue: false, disabled: true });
    expect(w.find('[role="checkbox"]').attributes("disabled")).toBeDefined();
    w.unmount();
  });

  it("applies size classes", () => {
    const w = mountCheckbox({ modelValue: false, size: "lg" });
    expect(w.find('[role="checkbox"]').classes()).toContain("size-5");
    w.unmount();
  });

  it("applies small size classes", () => {
    const w = mountCheckbox({ modelValue: false, size: "sm" });
    expect(w.find('[role="checkbox"]').classes()).toContain("size-3.5");
    w.unmount();
  });

  it("renders label before checkbox when labelPosition is before", () => {
    const w = mountCheckbox({
      modelValue: false,
      label: "Before",
      labelPosition: "before",
    });
    const labels = w.findAll("label");
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(labels[0].text()).toContain("Before");
    w.unmount();
  });

  it("renders label after checkbox when labelPosition is after", () => {
    const w = mountCheckbox({
      modelValue: false,
      label: "After",
      labelPosition: "after",
    });
    const labels = w.findAll("label");
    expect(labels.length).toBeGreaterThanOrEqual(1);
    expect(labels[labels.length - 1].text()).toContain("After");
    w.unmount();
  });

  it("shows loading state when loading is true", () => {
    const w = mountCheckbox({ modelValue: true, loading: true });
    // When loading, the indicator should show a spinner
    expect(w.find('[data-slot="checkbox-indicator"]').exists()).toBe(true);
    w.unmount();
  });

  it("hides icon when hideIcon is true", () => {
    const w = mountCheckbox({ modelValue: true, hideIcon: true });
    // hideIcon shows the indicator (force-mount) but no check icon
    expect(w.find('[data-slot="checkbox-indicator"]').exists()).toBe(true);
    w.unmount();
  });
});
