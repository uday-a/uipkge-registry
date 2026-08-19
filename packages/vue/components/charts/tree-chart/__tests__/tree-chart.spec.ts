import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { TreeChart } from "../index";

describe("TreeChart", () => {
  const sampleProps = { data: { name: "Root", children: [{ name: "Leaf" }] } };

  it("renders without crashing", () => {
    const wrapper = mount(TreeChart, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(TreeChart, {
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
