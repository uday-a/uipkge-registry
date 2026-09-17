import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../index";

function mountBreadcrumb() {
  return mount(
    {
      components: {
        Breadcrumb,
        BreadcrumbList,
        BreadcrumbItem,
        BreadcrumbLink,
        BreadcrumbSeparator,
      },
      template:
        '<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbLink href="#">Products</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem>Current</BreadcrumbItem></BreadcrumbList></Breadcrumb>',
    },
    { attachTo: document.body },
  );
}

describe("Breadcrumb", () => {
  it('renders with data-slot="breadcrumb"', () => {
    const w = mountBreadcrumb();
    expect(w.find('[data-slot="breadcrumb"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountBreadcrumb();
    expect(
      w.find('[data-slot="breadcrumb"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it('renders a nav element with aria-label="breadcrumb"', () => {
    const w = mountBreadcrumb();
    const nav = w.find('[data-slot="breadcrumb"]');
    expect(nav.element.tagName.toLowerCase()).toBe("nav");
    expect(nav.attributes("aria-label")).toBe("breadcrumb");
    w.unmount();
  });

  it('BreadcrumbList renders with data-slot="breadcrumb-list"', () => {
    const w = mountBreadcrumb();
    expect(w.find('[data-slot="breadcrumb-list"]').exists()).toBe(true);
    w.unmount();
  });

  it("BreadcrumbList renders an ol element", () => {
    const w = mountBreadcrumb();
    const list = w.find('[data-slot="breadcrumb-list"]');
    expect(list.element.tagName.toLowerCase()).toBe("ol");
    w.unmount();
  });

  it('BreadcrumbItem renders with data-slot="breadcrumb-item"', () => {
    const w = mountBreadcrumb();
    expect(w.findAll('[data-slot="breadcrumb-item"]').length).toBe(3);
    w.unmount();
  });

  it("BreadcrumbItem renders an li element", () => {
    const w = mountBreadcrumb();
    const item = w.find('[data-slot="breadcrumb-item"]');
    expect(item.element.tagName.toLowerCase()).toBe("li");
    w.unmount();
  });

  it('BreadcrumbLink renders with data-slot="breadcrumb-link"', () => {
    const w = mountBreadcrumb();
    expect(w.findAll('[data-slot="breadcrumb-link"]').length).toBe(2);
    w.unmount();
  });

  it("BreadcrumbLink renders an a element by default", () => {
    const w = mountBreadcrumb();
    const link = w.find('[data-slot="breadcrumb-link"]');
    expect(link.element.tagName.toLowerCase()).toBe("a");
    w.unmount();
  });

  it('BreadcrumbSeparator renders with data-slot="breadcrumb-separator"', () => {
    const w = mountBreadcrumb();
    expect(w.findAll('[data-slot="breadcrumb-separator"]').length).toBe(2);
    w.unmount();
  });

  it('BreadcrumbSeparator has role="presentation"', () => {
    const w = mountBreadcrumb();
    const sep = w.find('[data-slot="breadcrumb-separator"]');
    expect(sep.attributes("role")).toBe("presentation");
    w.unmount();
  });

  it('BreadcrumbSeparator has aria-hidden="true"', () => {
    const w = mountBreadcrumb();
    const sep = w.find('[data-slot="breadcrumb-separator"]');
    expect(sep.attributes("aria-hidden")).toBe("true");
    w.unmount();
  });

  it("Breadcrumb renders full breadcrumb trail", () => {
    const w = mountBreadcrumb();
    const text = w.text();
    expect(text).toContain("Home");
    expect(text).toContain("Products");
    expect(text).toContain("Current");
    w.unmount();
  });
});
