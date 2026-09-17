import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { SlopeChart } from "../index";

describe("SlopeChart", () => {
  const sampleProps = {
    data: [{ label: "A", values: [10, 20] }],
    points: ["2023", "2024"],
  };

  it("renders without crashing", () => {
    const wrapper = mount(SlopeChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(SlopeChart, {
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
