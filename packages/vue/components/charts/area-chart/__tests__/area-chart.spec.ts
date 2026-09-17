import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { AreaChart } from "../index";

describe("AreaChart", () => {
  const sampleProps = {
    data: [{ x: "Jan", y: 100 }],
    xField: "x",
    yField: "y",
  };

  it("renders without crashing", () => {
    const wrapper = mount(AreaChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(AreaChart, {
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
