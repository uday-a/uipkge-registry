import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { StackedAreaChart } from "../index";

describe("StackedAreaChart", () => {
  const sampleProps = {
    data: [{ m: "Jan", a: 10, b: 20 }],
    xField: "m",
    yFields: ["a", "b"],
  };

  it("renders without crashing", () => {
    const wrapper = mount(StackedAreaChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(StackedAreaChart, {
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
