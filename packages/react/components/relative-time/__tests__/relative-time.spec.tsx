import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RelativeTime } from "../relative-time";
import {
  formatAbsoluteTime,
  formatRelativeTime,
  formatVisibleTime,
  toDate,
} from "../format-relative-time";

const now = new Date("2026-08-14T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("formats seconds as now", () => {
    expect(
      formatRelativeTime(now, now, { locale: "en", numeric: "auto" }),
    ).toBe("now");
  });

  it("formats minutes ago", () => {
    const date = new Date(now.getTime() - 2 * 60_000);
    expect(
      formatRelativeTime(date, now, { locale: "en", numeric: "always" }),
    ).toBe("2 minutes ago");
  });

  it("formats yesterday with numeric auto", () => {
    const date = new Date(now.getTime() - 86_400_000);
    expect(
      formatRelativeTime(date, now, { locale: "en", numeric: "auto" }),
    ).toBe("yesterday");
  });

  it("formats a future day", () => {
    const date = new Date(now.getTime() + 86_400_000);
    expect(
      formatRelativeTime(date, now, { locale: "en", numeric: "auto" }),
    ).toBe("tomorrow");
  });
});

describe("toDate parseAs", () => {
  it("treats naive ISO as UTC when parseAs is utc", () => {
    expect(toDate("2026-08-14T12:00:00", "utc").toISOString()).toBe(
      "2026-08-14T12:00:00.000Z",
    );
  });
});

describe("formatAbsoluteTime", () => {
  it("formats UTC when timeZone is UTC", () => {
    expect(formatAbsoluteTime(now, "en-GB", "UTC")).toContain("12:00");
  });
});

describe("formatVisibleTime", () => {
  it("returns relative by default", () => {
    const date = new Date(now.getTime() - 2 * 60_000);
    expect(
      formatVisibleTime(date, now, { locale: "en", numeric: "always" }),
    ).toBe("2 minutes ago");
  });

  it("returns absolute when display is absolute", () => {
    expect(
      formatVisibleTime(now, now, {
        display: "absolute",
        locale: "en-GB",
        timeZone: "UTC",
      }),
    ).toContain("12:00");
  });

  it("joins both when display is both", () => {
    const date = new Date(now.getTime() - 2 * 60_000);
    const out = formatVisibleTime(date, now, {
      display: "both",
      locale: "en",
      numeric: "always",
      timeZone: "UTC",
    });
    expect(out.startsWith("2 minutes ago · ")).toBe(true);
  });
});

describe("RelativeTime", () => {
  it('renders with data-slot="relative-time"', () => {
    const { container } = render(
      <RelativeTime date={now} now={now} locale="en" />,
    );
    expect(container.querySelector('[data-slot="relative-time"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <RelativeTime date={now} now={now} locale="en" />,
    );
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders a time element with datetime", () => {
    const { container } = render(
      <RelativeTime date={now} now={now} locale="en" />,
    );
    const el = container.querySelector("time");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("datetime")).toBe(now.toISOString());
  });

  it("shows a relative label", () => {
    const date = new Date(now.getTime() - 2 * 60_000);
    const { container } = render(
      <RelativeTime date={date} now={now} locale="en" numeric="always" />,
    );
    expect(
      container.querySelector('[data-slot="relative-time"]')?.textContent,
    ).toBe("2 minutes ago");
  });

  it("shows absolute UTC when display is absolute", () => {
    const { container } = render(
      <RelativeTime
        date={now}
        now={now}
        locale="en-GB"
        display="absolute"
        timeZone="UTC"
      />,
    );
    expect(
      container.querySelector('[data-slot="relative-time"]')?.textContent,
    ).toContain("12:00");
    expect(
      container
        .querySelector('[data-slot="relative-time"]')
        ?.getAttribute("data-timezone"),
    ).toBe("UTC");
  });

  it("parses naive ISO as UTC", () => {
    const { container } = render(
      <RelativeTime
        date="2026-08-14T12:00:00"
        now={now}
        locale="en"
        parseAs="utc"
      />,
    );
    expect(container.querySelector("time")?.getAttribute("datetime")).toBe(
      "2026-08-14T12:00:00.000Z",
    );
  });

  it("accepts custom className", () => {
    const { container } = render(
      <RelativeTime
        date={now}
        now={now}
        locale="en"
        className="custom-class"
      />,
    );
    expect(
      container
        .querySelector('[data-slot="relative-time"]')
        ?.classList.contains("custom-class"),
    ).toBe(true);
  });
});
