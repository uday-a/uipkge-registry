import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { BeeswarmChart } from "../index";

describe("BeeswarmChart", () => {
  const sampleProps = {
    data: [{ value: 10, group: "A" }],
    valueField: "value",
    groupField: "group",
  };

  it("renders without crashing", () => {
    const wrapper = mount(BeeswarmChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(BeeswarmChart, {
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
