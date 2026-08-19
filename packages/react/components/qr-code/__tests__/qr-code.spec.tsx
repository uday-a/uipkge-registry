import { describe, it, expect, afterEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { QrCode } from "../QrCode";

afterEach(cleanup);

describe("QrCode", () => {
  it('renders with data-slot="qr-code"', () => {
    const { container } = render(<QrCode value="https://example.com" />);
    expect(container.querySelector('[data-slot="qr-code"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<QrCode value="https://example.com" />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders an img element for canvas type", async () => {
    const { container } = render(
      <QrCode value="https://example.com" type="canvas" />,
    );
    await waitFor(() => {
      expect(container.querySelector("img")).toBeTruthy();
    });
  });

  it("generates QR from value (img src is set)", async () => {
    const { container } = render(<QrCode value="https://example.com" />);
    await waitFor(() => {
      const img = container.querySelector("img");
      expect(img).toBeTruthy();
      expect(img?.getAttribute("src")).toBeTruthy();
    });
  });

  it("renders bordered container by default", () => {
    const { container } = render(<QrCode value="test" />);
    expect(
      container.querySelector('[data-slot="qr-code"]')?.className,
    ).toContain("border");
  });

  it("does not apply border when bordered=false", () => {
    const { container } = render(<QrCode value="test" bordered={false} />);
    expect(
      container.querySelector('[data-slot="qr-code"]')?.className,
    ).not.toContain("border");
  });
});
