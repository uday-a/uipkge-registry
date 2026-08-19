import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { PaymentCard } from "../payment-card";

describe("PaymentCard", () => {
  it('renders with data-slot="payment-card"', () => {
    const { container } = render(<PaymentCard />);
    expect(container.querySelector('[data-slot="payment-card"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<PaymentCard />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it('has role="img"', () => {
    const { container } = render(<PaymentCard />);
    expect(
      container
        .querySelector('[data-slot="payment-card"]')
        ?.getAttribute("role"),
    ).toBe("img");
  });

  it("renders the masked card number", () => {
    const { container } = render(<PaymentCard number="4242424242424242" />);
    expect(container.textContent).toContain("4242");
  });

  it("renders the card holder name", () => {
    const { container } = render(<PaymentCard name="John Doe" />);
    expect(container.textContent).toContain("JOHN DOE");
  });

  it("renders the expiry", () => {
    const { container } = render(<PaymentCard expiry="12/28" />);
    expect(container.textContent).toContain("12/28");
  });

  it("applies compact variant size class", () => {
    const { container } = render(<PaymentCard variant="compact" />);
    expect(
      container.querySelector('[data-slot="payment-card"]')?.className,
    ).toContain("w-[120px]");
  });
});
