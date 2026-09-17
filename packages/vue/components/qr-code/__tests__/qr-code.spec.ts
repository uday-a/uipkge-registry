import { describe, it, expect, vi } from "vitest";
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

  // Poll instead of sleeping a fixed 300ms: QR generation is async, and under
  // a loaded full-suite run the fixed wait expired before the image landed.
  it("renders an img element for canvas type", async () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com", type: "canvas" },
      attachTo: document.body,
    });
    await vi.waitFor(() => expect(w.find("img").exists()).toBe(true));
    w.unmount();
  });

  it("generates QR from value (img src is set)", async () => {
    const w = mount(QRCode, {
      props: { value: "https://example.com" },
      attachTo: document.body,
    });
    await vi.waitFor(() => {
      const img = w.find("img");
      expect(img.exists()).toBe(true);
      expect(img.attributes("src")).toBeTruthy();
    });
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
