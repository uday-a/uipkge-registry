import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, cleanup, act } from "@testing-library/react";
import { Countdown } from "../Countdown";

/** Fixed "now" so every assertion below is about the formatting, not the clock. */
const NOW = new Date("2026-01-01T00:00:00.000Z").getTime();
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Countdown (React)", () => {
  it('renders container with data-slot="countdown"', () => {
    const { container } = render(<Countdown target={NOW + MINUTE} />);
    expect(container.querySelector('[data-slot="countdown"]')).toBeTruthy();
  });

  it("renders custom label and unit separator", () => {
    const { container } = render(
      <Countdown target={NOW + MINUTE} label="Sale Ends In" separator=":" />,
    );
    expect(container.textContent).toContain("Sale Ends In");
    expect(container.textContent).toContain(":");
  });

  // The remaining time is the whole point of the component: a wrong roll-up
  // ("1 day left" shown as "01" hours) misleads on exactly the deadline the
  // consumer is counting down to.
  it("splits the remaining time into days, hours, minutes and seconds", () => {
    const { container } = render(
      <Countdown target={NOW + 2 * DAY + 3 * HOUR + 4 * MINUTE + 5 * SECOND} />,
    );
    const text = container.textContent ?? "";
    expect(text).toContain("02");
    expect(text).toContain("03");
    expect(text).toContain("04");
    expect(text).toContain("05");
  });

  it("rolls days into hours for HH:MM:SS and into minutes for MM:SS", () => {
    const hhmmss = render(
      <Countdown target={NOW + DAY + 2 * HOUR} format="HH:MM:SS" />,
    );
    // 1 day + 2 hours reported as 26 hours, not "01" days and "02" hours.
    expect(hhmmss.container.textContent).toContain("26");
    cleanup();

    const mmss = render(
      <Countdown target={NOW + 2 * HOUR + MINUTE} format="MM:SS" />,
    );
    expect(mmss.container.textContent).toContain("121");
  });

  it("honours pad=false so single digits are not zero-padded", () => {
    const padded = render(<Countdown target={NOW + 5 * SECOND} format="SS" />);
    expect(padded.container.textContent).toContain("05");
    cleanup();

    const bare = render(
      <Countdown target={NOW + 5 * SECOND} format="SS" pad={false} />,
    );
    expect(bare.container.textContent).toContain("5");
    expect(bare.container.textContent).not.toContain("05");
  });

  it("ticks down once per second and reports the remaining milliseconds", () => {
    const onTick = vi.fn();
    const { container } = render(
      <Countdown target={NOW + 10 * SECOND} format="SS" onTick={onTick} />,
    );
    expect(container.textContent).toContain("10");

    act(() => {
      vi.advanceTimersByTime(3 * SECOND);
    });

    expect(container.textContent).toContain("07");
    expect(onTick).toHaveBeenCalledTimes(3);
    expect(onTick).toHaveBeenLastCalledWith(7 * SECOND);
  });

  it("calls onFinish once when it reaches zero and then stops ticking", () => {
    const onFinish = vi.fn();
    const onTick = vi.fn();
    const { container } = render(
      <Countdown
        target={NOW + 2 * SECOND}
        format="SS"
        onFinish={onFinish}
        onTick={onTick}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(5 * SECOND);
    });

    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("00");

    const ticksAtFinish = onTick.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(5 * SECOND);
    });
    expect(onTick.mock.calls.length).toBe(ticksAtFinish);
  });

  it("calls onFinish immediately for a target already in the past", () => {
    const onFinish = vi.fn();
    const { container } = render(
      <Countdown target={NOW - MINUTE} format="SS" onFinish={onFinish} />,
    );
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(container.textContent).toContain("00");
  });

  it("stops while paused and resumes from the current time", () => {
    const onTick = vi.fn();
    const { container, rerender } = render(
      <Countdown
        target={NOW + 60 * SECOND}
        format="SS"
        paused
        onTick={onTick}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(5 * SECOND);
    });
    expect(onTick).not.toHaveBeenCalled();
    expect(container.textContent).toContain("60");

    rerender(
      <Countdown
        target={NOW + 60 * SECOND}
        format="SS"
        paused={false}
        onTick={onTick}
      />,
    );
    act(() => {
      vi.advanceTimersByTime(2 * SECOND);
    });
    // Wall-clock, not paused-time: 7s of real time have passed since mount.
    expect(container.textContent).toContain("53");
  });

  it("accepts a Date and an ISO string as well as epoch milliseconds", () => {
    const fromDate = render(
      <Countdown target={new Date(NOW + 30 * SECOND)} format="SS" />,
    );
    expect(fromDate.container.textContent).toContain("30");
    cleanup();

    const fromIso = render(
      <Countdown
        target={new Date(NOW + 45 * SECOND).toISOString()}
        format="SS"
      />,
    );
    expect(fromIso.container.textContent).toContain("45");
  });

  it("renders only the units named by the format", () => {
    const { container } = render(
      <Countdown target={NOW + DAY + HOUR} format="HH:MM" />,
    );
    expect(
      container.querySelector('[data-slot="countdown-hours"]'),
    ).toBeTruthy();
    expect(
      container.querySelector('[data-slot="countdown-minutes"]'),
    ).toBeTruthy();
    expect(container.querySelector('[data-slot="countdown-days"]')).toBeNull();
    expect(
      container.querySelector('[data-slot="countdown-seconds"]'),
    ).toBeNull();
  });

  // The default markup paints one span per unit, so literal characters in a
  // custom format only reach the DOM through the render prop's `display`.
  it("hands the render prop a display string with DD/HH/MM/SS tokens substituted", () => {
    const { container } = render(
      <Countdown target={NOW + DAY + HOUR} format="DDd HHh MMm">
        {({ display }) => <span className="custom">{display}</span>}
      </Countdown>,
    );
    expect(container.querySelector(".custom")?.textContent).toBe("01d 01h 00m");
  });

  it("clears its interval on unmount", () => {
    const clearSpy = vi.spyOn(globalThis, "clearInterval");
    const { unmount } = render(<Countdown target={NOW + MINUTE} />);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
