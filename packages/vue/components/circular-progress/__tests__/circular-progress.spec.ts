import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { CircularProgress } from "../index";

describe("CircularProgress", () => {
  it('renders a container with data-slot="circular-progress"', () => {
    const w = mount(CircularProgress, { attachTo: document.body });
    expect(w.find('[data-slot="circular-progress"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(CircularProgress, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders an svg element", () => {
    const w = mount(CircularProgress, { attachTo: document.body });
    expect(w.find("svg").exists()).toBe(true);
    w.unmount();
  });

  it("renders a track circle (first circle)", () => {
    const w = mount(CircularProgress, { attachTo: document.body });
    const circles = w.findAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(2);
    // Track circle has stroke matching --muted by default
    expect(circles[0].attributes("stroke")).toBe("var(--muted)");
    w.unmount();
  });

  it("renders a progress circle (second circle)", () => {
    const w = mount(CircularProgress, {
      props: { value: 50 },
      attachTo: document.body,
    });
    const circles = w.findAll("circle");
    expect(circles.length).toBeGreaterThanOrEqual(2);
    // Progress circle has stroke matching --primary by default
    expect(circles[1].attributes("stroke")).toBe("var(--primary)");
    expect(circles[1].attributes("stroke-linecap")).toBe("round");
    w.unmount();
  });

  it('sets data-indeterminate="true" when indeterminate', () => {
    const w = mount(CircularProgress, {
      props: { indeterminate: true },
      attachTo: document.body,
    });
    expect(
      w
        .find('[data-slot="circular-progress"]')
        .attributes("data-indeterminate"),
    ).toBe("true");
    w.unmount();
  });

  it('sets data-complete="true" when value reaches 100', () => {
    const w = mount(CircularProgress, {
      props: { value: 100 },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="circular-progress"]').attributes("data-complete"),
    ).toBe("true");
    w.unmount();
  });

  it("shows numeric value when showValue is true", () => {
    const w = mount(CircularProgress, {
      props: { value: 42, showValue: true },
      attachTo: document.body,
    });
    expect(w.text()).toContain("42");
    w.unmount();
  });
});
