import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { IconTransition } from "../index";

const DefaultIcon = (props: { className?: string }) => (
  <svg
    className={`default-icon ${props.className ?? ""}`}
    data-testid="default-icon"
  />
);
const ActiveIcon = (props: { className?: string }) => (
  <svg
    className={`active-icon ${props.className ?? ""}`}
    data-testid="active-icon"
  />
);

// The component schedules a setTimeout to clean up the leaving icon slot.
// Use fake timers so that timer doesn't fire after the jsdom environment
// is torn down (which throws "window is not defined").
describe("IconTransition", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders with data-slot="icon-transition"', () => {
    const { container } = render(
      <IconTransition defaultIcon={DefaultIcon} activeIcon={ActiveIcon} />,
    );
    expect(
      container.querySelector('[data-slot="icon-transition"]'),
    ).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <IconTransition defaultIcon={DefaultIcon} activeIcon={ActiveIcon} />,
    );
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as a button by default", () => {
    const { container } = render(
      <IconTransition defaultIcon={DefaultIcon} activeIcon={ActiveIcon} />,
    );
    expect(
      container
        .querySelector('[data-slot="icon-transition"]')
        ?.tagName.toLowerCase(),
    ).toBe("button");
  });

  it("renders the default icon initially", () => {
    const { container } = render(
      <IconTransition defaultIcon={DefaultIcon} activeIcon={ActiveIcon} />,
    );
    expect(container.querySelector("svg.default-icon")).toBeTruthy();
  });

  it("renders the active icon when active prop is true", () => {
    const { container } = render(
      <IconTransition
        defaultIcon={DefaultIcon}
        activeIcon={ActiveIcon}
        active
      />,
    );
    expect(container.querySelector("svg.active-icon")).toBeTruthy();
  });

  it("applies activeClass when active", () => {
    const { container } = render(
      <IconTransition
        defaultIcon={DefaultIcon}
        activeIcon={ActiveIcon}
        active
        activeClass="text-success"
      />,
    );
    expect(
      container.querySelector('[data-slot="icon-transition"]')?.className,
    ).toContain("text-success");
  });

  it("transitions to active icon on click (resetAfter=0 keeps active)", () => {
    const { container } = render(
      <IconTransition
        defaultIcon={DefaultIcon}
        activeIcon={ActiveIcon}
        resetAfter={0}
      />,
    );
    fireEvent.click(container.querySelector('[data-slot="icon-transition"]')!);
    expect(container.querySelector("svg.active-icon")).toBeTruthy();
    // Flush the prevActive cleanup timer before teardown
    vi.advanceTimersByTime(500);
  });
});
