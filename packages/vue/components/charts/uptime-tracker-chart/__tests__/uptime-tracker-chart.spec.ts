import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { UptimeTrackerChart } from "../index";

describe("UptimeTrackerChart", () => {
  const sampleProps = { days: [{ date: "2024-01-01", status: "operational" }] };

  it("renders without crashing", () => {
    const wrapper = mount(UptimeTrackerChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(UptimeTrackerChart, {
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
