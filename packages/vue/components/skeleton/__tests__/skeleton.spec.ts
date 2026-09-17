import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Skeleton } from "../index";

describe("Skeleton", () => {
  it('renders with data-slot="skeleton"', () => {
    const w = mount(Skeleton, { attachTo: document.body });
    expect(w.find('[data-slot="skeleton"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Skeleton, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders as a div", () => {
    const w = mount(Skeleton, { attachTo: document.body });
    expect(w.find('div[data-slot="skeleton"]').exists()).toBe(true);
    w.unmount();
  });

  it("applies rectangular variant classes (default)", () => {
    const w = mount(Skeleton, {
      props: { variant: "rectangular" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').exists()).toBe(true);
    w.unmount();
  });

  it("applies rounded variant classes", () => {
    const w = mount(Skeleton, {
      props: { variant: "rounded" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').classes()).toContain("rounded-md");
    w.unmount();
  });

  it("applies circular variant classes", () => {
    const w = mount(Skeleton, {
      props: { variant: "circular" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').classes()).toContain(
      "rounded-full",
    );
    w.unmount();
  });

  it("applies text variant classes", () => {
    const w = mount(Skeleton, {
      props: { variant: "text" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').classes()).toContain("h-4");
    w.unmount();
  });

  it("applies width style when width prop is set", () => {
    const w = mount(Skeleton, {
      props: { width: "200px" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').attributes("style")).toContain(
      "width",
    );
    w.unmount();
  });

  it("applies height style when height prop is set", () => {
    const w = mount(Skeleton, {
      props: { height: "100px" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').attributes("style")).toContain(
      "height",
    );
    w.unmount();
  });

  it("renders slot content when loading is false", () => {
    const w = mount(Skeleton, {
      props: { loading: false },
      slots: { default: "<p>Loaded</p>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Loaded");
    expect(w.find('[data-slot="skeleton"]').exists()).toBe(false);
    w.unmount();
  });

  it("shows shimmer animation when loading is true", () => {
    const w = mount(Skeleton, {
      props: { loading: true },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').classes()).toContain(
      "skeleton-shimmer",
    );
    w.unmount();
  });

  it("has aria-hidden when loading", () => {
    const w = mount(Skeleton, {
      props: { loading: true },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="skeleton"]').attributes("aria-hidden")).toBe(
      "true",
    );
    w.unmount();
  });
});
