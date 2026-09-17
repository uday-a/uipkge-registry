import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { QRCode } from "../index";

describe("QRCode", () => {
  it('renders with data-slot="qr-code"', () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="qr-code"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com" },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders an img element for canvas type", async () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com", type: "canvas" },
      attachTo: document.body,
    });
    await new Promise((r) => setTimeout(r, 300));
    expect(w.find("img").exists()).toBe(true);
    w.unmount();
  });

  it("generates QR from value (img src is set)", async () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com" },
      attachTo: document.body,
    });
    // Wait for async QR generation
    await new Promise((r) => setTimeout(r, 300));
    const img = w.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBeTruthy();
    w.unmount();
  });

  it("renders bordered container by default", () => {
    const w = mount(QRCode, {
      props: { value: "test" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="qr-code"]').classes()).toContain("border");
    w.unmount();
  });

  it("does not apply border when bordered=false", () => {
    const w = mount(QRCode, {
      props: { value: "test", bordered: false },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="qr-code"]').classes()).not.toContain("border");
    w.unmount();
  });
});
