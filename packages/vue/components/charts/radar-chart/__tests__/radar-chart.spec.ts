import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { RadarChart } from "../index";

describe("RadarChart", () => {
  const sampleProps = {
    indicators: [{ name: "A", max: 100 }],
    data: [{ name: "Series", value: [50] }],
  };

  it("renders without crashing", () => {
    const wrapper = mount(RadarChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(RadarChart, {
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
