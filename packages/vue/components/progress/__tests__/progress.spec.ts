import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Progress } from "../index";

describe("Progress", () => {
  it('renders with data-slot="progress"', () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it('has role="progressbar"', () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("role")).toBe(
      "progressbar",
    );
    w.unmount();
  });

  it("renders indicator element", () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress-indicator"]').exists()).toBe(true);
    w.unmount();
  });

  it("sets aria-valuenow based on modelValue", () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("aria-valuenow")).toBe(
      "50",
    );
    w.unmount();
  });

  it("sets aria-valuemin to 0", () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("aria-valuemin")).toBe(
      "0",
    );
    w.unmount();
  });

  it("sets aria-valuemax to 100", () => {
    const w = mount(Progress, {
      props: { modelValue: 50 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("aria-valuemax")).toBe(
      "100",
    );
    w.unmount();
  });

  it("clamps value to 0-100 range (above)", () => {
    const w = mount(Progress, {
      props: { modelValue: 150 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("aria-valuenow")).toBe(
      "100",
    );
    w.unmount();
  });

  it("clamps value to 0-100 range (below)", () => {
    const w = mount(Progress, {
      props: { modelValue: -10 },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="progress"]').attributes("aria-valuenow")).toBe(
      "0",
    );
    w.unmount();
  });
});
