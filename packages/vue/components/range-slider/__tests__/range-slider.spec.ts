import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RangeSlider from "../RangeSlider.vue";

function mountRangeSlider(props: Record<string, unknown> = {}) {
  return mount(
    {
      components: { RangeSlider },
      data() {
        return { val: props.modelValue ?? [20, 80], ...props };
      },
      template: `
        <RangeSlider
          :model-value="val"
          :default-value="defaultValue"
          :min="min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :label="label"
          :hint="hint"
          :error-messages="errorMessages"
          :error="error"
          :color="color"
          :thumb-size="thumbSize"
          :track-height="trackHeight"
          :show-ticks="showTicks"
          :thumb-label="thumbLabel"
          @update:model-value="val = $event"
        />`,
      computed: {
        defaultValue: () => props.defaultValue,
        min: () => props.min,
        max: () => props.max,
        step: () => props.step,
        disabled: () => props.disabled,
        label: () => props.label,
        hint: () => props.hint,
        errorMessages: () => props.errorMessages,
        error: () => props.error,
        color: () => props.color,
        thumbSize: () => props.thumbSize,
        trackHeight: () => props.trackHeight,
        showTicks: () => props.showTicks,
        thumbLabel: () => props.thumbLabel,
      },
    },
    { attachTo: document.body },
  );
}

describe("RangeSlider", () => {
  it('renders with data-slot="range-slider"', () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    expect(w.find('[data-slot="range-slider"]').exists()).toBe(true);
    w.unmount();
  });

  it('renders track with data-slot="slider-track"', () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    expect(w.find('[data-slot="slider-track"]').exists()).toBe(true);
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it('renders range with data-slot="slider-range"', () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    expect(w.find('[data-slot="slider-range"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders two thumbs", () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    expect(w.findAll('[data-slot="slider-thumb"]').length).toBe(2);
    w.unmount();
  });

  it("renders two slider role elements", () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    expect(w.findAll('[role="slider"]').length).toBe(2);
    w.unmount();
  });

  it("renders label text", () => {
    const w = mountRangeSlider({ modelValue: [20, 80], label: "Price Range" });
    expect(w.text()).toContain("Price Range");
    w.unmount();
  });

  it("renders hint text", () => {
    const w = mountRangeSlider({
      modelValue: [20, 80],
      hint: "Drag to adjust",
    });
    expect(w.text()).toContain("Drag to adjust");
    w.unmount();
  });

  it("renders error messages", () => {
    const w = mountRangeSlider({
      modelValue: [20, 80],
      errorMessages: "Invalid range",
    });
    expect(w.text()).toContain("Invalid range");
    w.unmount();
  });

  it("shows min and max value displays", () => {
    const w = mountRangeSlider({ modelValue: [20, 80], min: 0, max: 100 });
    expect(w.text()).toContain("20");
    expect(w.text()).toContain("80");
    w.unmount();
  });

  it("disables slider when disabled prop is true", () => {
    const w = mountRangeSlider({ modelValue: [20, 80], disabled: true });
    expect(
      w.find('[data-slot="range-slider"]').attributes("data-disabled"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders ticks when showTicks is true", () => {
    const w = mountRangeSlider({
      modelValue: [20, 80],
      showTicks: true,
      min: 0,
      max: 100,
      step: 25,
    });
    expect(w.find('[data-slot="range-slider"]').exists()).toBe(true);
    w.unmount();
  });

  it("sets aria-valuenow on thumbs", () => {
    const w = mountRangeSlider({ modelValue: [20, 80] });
    const thumbs = w.findAll('[role="slider"]');
    expect(thumbs[0].attributes("aria-valuenow")).toBe("20");
    expect(thumbs[1].attributes("aria-valuenow")).toBe("80");
    w.unmount();
  });

  it("uses defaultValue when modelValue is not provided", () => {
    const w = mount(
      {
        components: { RangeSlider },
        template: '<RangeSlider :default-value="[10, 90]" />',
      },
      { attachTo: document.body },
    );
    const thumbs = w.findAll('[role="slider"]');
    expect(thumbs[0].attributes("aria-valuenow")).toBe("10");
    expect(thumbs[1].attributes("aria-valuenow")).toBe("90");
    w.unmount();
  });
});
