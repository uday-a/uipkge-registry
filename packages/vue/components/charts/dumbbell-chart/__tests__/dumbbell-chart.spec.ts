import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { DumbbellChart } from "../index";

describe("DumbbellChart", () => {
  const sampleProps = {
    data: [{ category: "A", start: 10, end: 20 }],
    names: ["Q1", "Q2"],
  };

  it("renders without crashing", () => {
    const wrapper = mount(DumbbellChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(DumbbellChart, {
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
