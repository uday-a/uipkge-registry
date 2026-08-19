import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { EffectScatterChart } from "../index";

describe("EffectScatterChart", () => {
  const sampleProps = {
    data: [{ x: 1, y: 2, c: "A" }],
    xField: "x",
    yField: "y",
    categoryField: "c",
  };

  it("renders without crashing", () => {
    const wrapper = mount(EffectScatterChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(EffectScatterChart, {
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
