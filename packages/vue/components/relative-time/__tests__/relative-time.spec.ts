import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { RelativeTime } from "../index";
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
    const w = mount(RelativeTime, {
      props: { date: now, now, locale: "en" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="relative-time"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mount(RelativeTime, {
      props: { date: now, now, locale: "en" },
      attachTo: document.body,
    });
    expect(w.find("[data-uipkge]").exists()).toBe(true);
    w.unmount();
  });

  it("renders a time element with datetime", () => {
    const w = mount(RelativeTime, {
      props: { date: now, now, locale: "en" },
      attachTo: document.body,
    });
    const el = w.find("time");
    expect(el.exists()).toBe(true);
    expect(el.attributes("datetime")).toBe(now.toISOString());
    w.unmount();
  });

  it("shows a relative label", () => {
    const date = new Date(now.getTime() - 2 * 60_000);
    const w = mount(RelativeTime, {
      props: { date, now, locale: "en", numeric: "always" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="relative-time"]').text()).toBe("2 minutes ago");
    w.unmount();
  });

  it("shows absolute UTC when display is absolute", () => {
    const w = mount(RelativeTime, {
      props: {
        date: now,
        now,
        locale: "en-GB",
        display: "absolute",
        timeZone: "UTC",
      },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="relative-time"]').text()).toContain("12:00");
    expect(
      w.find('[data-slot="relative-time"]').attributes("data-timezone"),
    ).toBe("UTC");
    w.unmount();
  });

  it("parses naive ISO as UTC", () => {
    const w = mount(RelativeTime, {
      props: {
        date: "2026-08-14T12:00:00",
        now,
        locale: "en",
        parseAs: "utc",
        numeric: "auto",
      },
      attachTo: document.body,
    });
    expect(w.find("time").attributes("datetime")).toBe(
      "2026-08-14T12:00:00.000Z",
    );
    w.unmount();
  });

  it("accepts custom class", () => {
    const w = mount(RelativeTime, {
      props: { date: now, now, locale: "en", class: "custom-class" },
      attachTo: document.body,
    });
    expect(w.find('[data-slot="relative-time"]').classes()).toContain(
      "custom-class",
    );
    w.unmount();
  });
});
