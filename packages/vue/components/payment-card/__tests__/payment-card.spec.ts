import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { PaymentCard } from "../index";

describe("PaymentCard", () => {
  it('renders with data-slot="payment-card"', () => {
    const w = mount(PaymentCard, { attachTo: document.body });
    expect(w.find('[data-slot="payment-card"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(PaymentCard, { attachTo: document.body });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it('has role="img"', () => {
    const w = mount(PaymentCard, { attachTo: document.body });
    expect(w.find('[data-slot="payment-card"]').attributes("role")).toBe("img");
    w.unmount();
  });

  it("renders the masked card number", () => {
    const w = mount(PaymentCard, {
      props: { number: "4242424242424242" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("4242");
    w.unmount();
  });

  it("renders the card holder name", () => {
    const w = mount(PaymentCard, {
      props: { name: "John Doe" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("JOHN DOE");
    w.unmount();
  });

  it("renders the expiry", () => {
    const w = mount(PaymentCard, {
      props: { expiry: "12/28" },
      attachTo: document.body,
    });
    expect(w.text()).toContain("12/28");
    w.unmount();
  });

  it("applies compact variant size class", () => {
    const w = mount(PaymentCard, {
      props: { variant: "compact" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="payment-card"]').classes()).toContain(
      "w-[120px]",
    );
    w.unmount();
  });
});
