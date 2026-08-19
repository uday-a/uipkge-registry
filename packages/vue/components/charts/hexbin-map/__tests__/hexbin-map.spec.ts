import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { HexbinMap } from "../index";

describe("HexbinMap", () => {
  const sampleProps = { data: [{ id: "CA", value: 10 }] };

  it("renders without crashing", () => {
    const wrapper = mount(HexbinMap, {
      props: sampleProps,
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.element).toBeDefined();
    wrapper.unmount();
  });

  it("renders expected content or unique feature", () => {
    const wrapper = mount(HexbinMap, {
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
