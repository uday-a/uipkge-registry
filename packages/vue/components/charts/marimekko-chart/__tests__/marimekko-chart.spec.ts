import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { MarimekkoChart } from "../index";

describe("MarimekkoChart", () => {
  const sampleProps = {
    columns: [{ name: "Col", values: [{ name: "Seg", value: 100 }] }],
  };

  it("renders without crashing", () => {
    const wrapper = mount(MarimekkoChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(MarimekkoChart, {
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
