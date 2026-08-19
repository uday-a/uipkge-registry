import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { ScatterChart } from "../index";

describe("ScatterChart", () => {
  const sampleProps = { data: [{ x: 1, y: 2 }], xField: "x", yField: "y" };

  it("renders without crashing", () => {
    const wrapper = mount(ScatterChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(ScatterChart, {
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
