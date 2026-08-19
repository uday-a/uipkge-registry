import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup, waitFor } from "@testing-library/react";
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
  PinInputSeparator,
} from "../pin-input";

// input-otp schedules timers internally that fire after test teardown.
// Use fake timers during each test and flush them before cleanup to avoid
// uncaught "Cannot read properties of undefined" errors from input-otp.
afterEach(async () => {
  await waitFor(() => {}, { timeout: 1000 });
  cleanup();
  // Give the event loop a chance to settle remaining microtasks
  await new Promise((resolve) => setTimeout(resolve, 100));
});

describe("PinInput", () => {
  it('renders with data-slot="pin-input"', () => {
    const { container } = render(
      <PinInput maxLength={4}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
          <PinInputSlot index={2} />
          <PinInputSlot index={3} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(container.querySelector('[data-slot="pin-input"]')).toBeTruthy();
  });

  it("renders correct number of slots", () => {
    const { container } = render(
      <PinInput maxLength={4}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
          <PinInputSlot index={2} />
          <PinInputSlot index={3} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(
      container.querySelectorAll('[data-slot="pin-input-slot"]').length,
    ).toBe(4);
  });

  it("sets data-status when status is set", () => {
    const { container } = render(
      <PinInput maxLength={4} status="error">
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(
      container
        .querySelector('[data-slot="pin-input"]')
        ?.getAttribute("data-status"),
    ).toBe("error");
  });

  it("does not set data-status when default", () => {
    const { container } = render(
      <PinInput maxLength={4}>
        <PinInputGroup>
          <PinInputSlot index={0} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(
      container
        .querySelector('[data-slot="pin-input"]')
        ?.hasAttribute("data-status"),
    ).toBe(false);
  });

  it("renders slots with data-uipkge", () => {
    const { container } = render(
      <PinInput maxLength={2}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    const slots = container.querySelectorAll('[data-slot="pin-input-slot"]');
    slots.forEach((slot) => {
      expect(slot.hasAttribute("data-uipkge")).toBe(true);
    });
  });

  it("renders PinInputGroup with data-slot", () => {
    const { container } = render(
      <PinInput maxLength={2}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(
      container.querySelector('[data-slot="pin-input-group"]'),
    ).toBeTruthy();
  });

  it("renders PinInputSeparator with data-slot", () => {
    const { container } = render(
      <PinInput maxLength={3}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSeparator />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(
      container.querySelector('[data-slot="pin-input-separator"]'),
    ).toBeTruthy();
  });

  it("calls onComplete when filled", () => {
    const onComplete = vi.fn();
    const { container } = render(
      <PinInput maxLength={2} onComplete={onComplete}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    const input = container.querySelector("input")!;
    fireEvent.change(input, { target: { value: "12" } });
    expect(onComplete).toHaveBeenCalledWith("12");
  });

  it("renders without crashing in uncontrolled mode", () => {
    const { container } = render(
      <PinInput maxLength={4}>
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
          <PinInputSlot index={2} />
          <PinInputSlot index={3} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("renders a hidden input element", () => {
    const { container } = render(
      <PinInput maxLength={4}>
        <PinInputGroup>
          <PinInputSlot index={0} />
        </PinInputGroup>
      </PinInput>,
    );
    expect(container.querySelector("input")).toBeTruthy();
  });

  it("applies size classes to slots", () => {
    const { container } = render(
      <PinInput maxLength={2} size="lg">
        <PinInputGroup>
          <PinInputSlot index={0} />
          <PinInputSlot index={1} />
        </PinInputGroup>
      </PinInput>,
    );
    const slot = container.querySelector('[data-slot="pin-input-slot"]')!;
    expect(slot.className).toContain("h-12");
  });
});
