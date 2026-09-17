import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { RangeCalendar } from "../index";

function mountRangeCalendar() {
  return mount(
    {
      template: "<RangeCalendar />",
      components: { RangeCalendar },
    },
    { attachTo: document.body },
  );
}

describe("RangeCalendar", () => {
  it('renders with data-slot="range-calendar"', () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountRangeCalendar();
    expect(
      w.find('[data-slot="range-calendar"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("renders a grid with dates", () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar-grid"]').exists()).toBe(true);
    expect(
      w.findAll('[data-slot="range-calendar-trigger"]').length,
    ).toBeGreaterThan(0);
    w.unmount();
  });

  it("renders weekday headers", () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar-grid-head"]').exists()).toBe(
      true,
    );
    expect(
      w.findAll('[data-slot="range-calendar-head-cell"]').length,
    ).toBeGreaterThan(0);
    w.unmount();
  });

  it("has navigation buttons", () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar-prev-button"]').exists()).toBe(
      true,
    );
    expect(w.find('[data-slot="range-calendar-next-button"]').exists()).toBe(
      true,
    );
    w.unmount();
  });

  it("renders without crashing", () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar"]').exists()).toBe(true);
    expect(w.find('[data-slot="range-calendar-header"]').exists()).toBe(true);
    w.unmount();
  });

  it("renders a heading with month/year", () => {
    const w = mountRangeCalendar();
    expect(w.find('[data-slot="range-calendar-heading"]').exists()).toBe(true);
    expect(
      w.find('[data-slot="range-calendar-heading"]').text().trim().length,
    ).toBeGreaterThan(0);
    w.unmount();
  });
});
