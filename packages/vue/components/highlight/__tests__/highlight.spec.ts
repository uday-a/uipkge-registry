import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Highlight } from "../index";

describe("Highlight", () => {
  it('renders with data-slot="highlight"', () => {
    const w = mount(Highlight, {
      props: { text: "hello world", query: "world" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="highlight"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Highlight, {
      props: { text: "hello", query: "ell" },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders as a span", () => {
    const w = mount(Highlight, {
      props: { text: "hello", query: "ell" },
      attachTo: document.body,
    });
    expect(
      w.find('[data-slot="highlight"]').element.tagName.toLowerCase(),
    ).toBe("span");
    w.unmount();
  });

  it("renders the full text content", () => {
    const w = mount(Highlight, {
      props: { text: "hello world", query: "xyz" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("hello world");
    w.unmount();
  });

  it('wraps matched substring in a mark with data-slot="highlight-match"', () => {
    const w = mount(Highlight, {
      props: { text: "hello world", query: "world" },
      attachTo: document.body,
    });
    const match = w.find('[data-slot="highlight-match"]');
    expect(match.exists()).toBe(true);
    expect(match.element.tagName.toLowerCase()).toBe("mark");
    expect(match.text()).toBe("world");
    w.unmount();
  });

  it('uses span tag when highlightTag is "span"', () => {
    const w = mount(Highlight, {
      props: { text: "hello world", query: "world", highlightTag: "span" },
      attachTo: document.body,
    });
    const match = w.find('[data-slot="highlight-match"]');
    expect(match.element.tagName.toLowerCase()).toBe("span");
    w.unmount();
  });

  it("caps highlights at maxHighlights", () => {
    const w = mount(Highlight, {
      props: { text: "a a a", query: "a", maxHighlights: 2 },
      attachTo: document.body,
    });
    expect(w.findAll('[data-slot="highlight-match"]').length).toBe(2);
    w.unmount();
  });
});
