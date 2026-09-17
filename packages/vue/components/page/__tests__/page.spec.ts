import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { Page, PageHeader, PageHeaderHeading, PageBody } from "../index";

describe("Page", () => {
  it('renders with data-slot="page"', () => {
    const w = mount(Page, { attachTo: document.body });
    expect(w.find('[data-slot="page"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(Page, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders slot content", () => {
    const w = mount(Page, {
      slots: { default: "<p>Body</p>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Body");
    w.unmount();
  });
});

describe("PageHeader", () => {
  it('renders with data-slot="page-header"', () => {
    const w = mount(PageHeader, { attachTo: document.body });
    expect(w.find('[data-slot="page-header"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(PageHeader, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders default slot content", () => {
    const w = mount(PageHeader, {
      slots: { default: "<span>Heading</span>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Heading");
    w.unmount();
  });

  it("renders actions slot content", () => {
    const w = mount(PageHeader, {
      slots: { actions: "<button>Action</button>" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Action");
    w.unmount();
  });
});

describe("PageHeaderHeading", () => {
  it('renders with data-slot="page-header-heading"', () => {
    const w = mount(PageHeaderHeading, {
      props: { title: "My Title" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="page-header-heading"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(PageHeaderHeading, {
      props: { title: "My Title" },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders the title in an h2", () => {
    const w = mount(PageHeaderHeading, {
      props: { title: "My Title" },
      attachTo: document.body,
    });
    expect(w.find("h2").text()).toBe("My Title");
    w.unmount();
  });

  it("renders description when provided", () => {
    const w = mount(PageHeaderHeading, {
      props: { title: "T", description: "Desc" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("Desc");
    w.unmount();
  });
});

describe("PageBody", () => {
  it('renders with data-slot="page-body"', () => {
    const w = mount(PageBody, { attachTo: document.body });
    expect(w.find('[data-slot="page-body"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(PageBody, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });
});
