import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { CalendarHeatmap } from "../index";

describe("CalendarHeatmap", () => {
  const sampleProps = { data: [["2024-01-01", 1]], range: "2024" };

  it("renders without crashing", () => {
    const wrapper = mount(CalendarHeatmap, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(CalendarHeatmap, {
      props: {
        ...sampleProps,
        class: "custom-chart-test",
        height: 380,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("custom-chart-test");
    wrapper.unmount();
  });
});
