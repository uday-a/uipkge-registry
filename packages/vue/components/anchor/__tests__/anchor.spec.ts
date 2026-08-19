import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Anchor } from "../index";

// IntersectionObserver is not available in happy-dom; polyfill locally.
class IO {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}
// @ts-expect-error test polyfill
globalThis.IntersectionObserver = globalThis.IntersectionObserver ?? IO;

describe("Anchor", () => {
  it('renders nav element with data-slot="anchor"', () => {
    const w = mount(Anchor, { attachTo: document.body });
    expect(w.find('[data-slot="anchor"]').exists()).toBe(true);
    expect(w.find('nav[data-slot="anchor"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on nav", () => {
    const w = mount(Anchor, { attachTo: document.body });
    expect(w.find('[data-slot="anchor"][data-uipkge]').exists()).toBe(true);
    w.unmount();
  });

  it("renders AnchorLink children from items prop", () => {
    const w = mount(Anchor, {
      props: {
        items: [
          { href: "#section-1", title: "Section 1" },
          { href: "#section-2", title: "Section 2" },
        ],
      },
      attachTo: document.body,
    });
    const links = w.findAll('[data-slot="anchor-link"]');
    expect(links.length).toBe(2);
    w.unmount();
  });

  it("renders href on anchor links", () => {
    const w = mount(Anchor, {
      props: { items: [{ href: "#section-1", title: "Section 1" }] },
      attachTo: document.body,
    });
    const link = w.find('[data-slot="anchor-link"] a');
    expect(link.attributes("href")).toBe("#section-1");
    w.unmount();
  });

  it("renders title text on anchor links", () => {
    const w = mount(Anchor, {
      props: { items: [{ href: "#sec", title: "My Section" }] },
      attachTo: document.body,
    });
    expect(w.text()).toContain("My Section");
    w.unmount();
  });

  it("renders default slot when no items provided", () => {
    const w = mount(Anchor, {
      slots: { default: "<div>Custom content</div>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Custom content");
    w.unmount();
  });
});
