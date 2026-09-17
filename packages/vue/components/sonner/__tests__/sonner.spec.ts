import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Toaster } from "../index";

describe("Sonner / Toaster", () => {
  it("renders without crashing", () => {
    const w = mount(Toaster, { attachTo: document.body });
    expect(w.html()).toBeTruthy();
    w.unmount();
  });

  it("renders a toaster section", () => {
    const w = mount(Toaster, { attachTo: document.body });
    expect(w.find("[data-sonner-toaster]").exists()).toBe(true);
    w.unmount();
  });

  it("renders with default position (bottom-right)", () => {
    const w = mount(Toaster, { attachTo: document.body });
    const toaster = w.find("[data-sonner-toaster]");
    expect(toaster.attributes("data-y-position")).toBe("bottom");
    expect(toaster.attributes("data-x-position")).toBe("right");
    w.unmount();
  });

  it("accepts custom position prop (top-center)", () => {
    const w = mount(Toaster, {
      props: { position: "top-center" },
      attachTo: document.body,
    });
    const toaster = w.find("[data-sonner-toaster]");
    expect(toaster.attributes("data-y-position")).toBe("top");
    expect(toaster.attributes("data-x-position")).toBe("center");
    w.unmount();
  });
});
