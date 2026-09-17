import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Heatmap } from "../index";

describe("Heatmap", () => {
  const sampleProps = { data: [[0, 0, 5]], xLabels: ["A"], yLabels: ["B"] };

  it("renders without crashing", () => {
    const wrapper = mount(Heatmap, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(Heatmap, {
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
