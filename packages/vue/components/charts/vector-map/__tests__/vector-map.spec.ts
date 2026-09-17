import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { VectorMap } from "../index";

describe("VectorMap", () => {
  const sampleProps = { regionData: [{ id: "NA", value: 10 }] };

  it("renders without crashing", () => {
    const wrapper = mount(VectorMap, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(VectorMap, {
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
