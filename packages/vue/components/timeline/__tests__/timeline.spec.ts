import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Timeline,
  TimelineItem,
  TimelineMedia,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineDate,
} from "../index";

function mountTimeline() {
  return mount(
    {
      template:
        "<Timeline><TimelineItem><TimelineMedia /><TimelineContent><TimelineTitle>Title 1</TimelineTitle><TimelineDescription>Description 1</TimelineDescription><TimelineDate>Jan 1</TimelineDate></TimelineContent></TimelineItem></Timeline>",
      components: {
        Timeline,
        TimelineItem,
        TimelineMedia,
        TimelineContent,
        TimelineTitle,
        TimelineDescription,
        TimelineDate,
      },
    },
    { attachTo: document.body },
  );
}

describe("Timeline", () => {
  it('renders with data-slot="timeline"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge", () => {
    const w = mountTimeline();
    expect(
      w.find('[data-slot="timeline"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("applies data-direction (vertical by default)", () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline"]').attributes("data-direction")).toBe(
      "vertical",
    );
    w.unmount();
  });

  it("applies data-align", () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline"]').attributes("data-align")).toBe(
      "start",
    );
    w.unmount();
  });

  it('TimelineItem renders with data-slot="timeline-item"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-item"]').exists()).toBe(true);
    w.unmount();
  });

  it("TimelineItem has data-uipkge", () => {
    const w = mountTimeline();
    expect(
      w.find('[data-slot="timeline-item"]').attributes("data-uipkge"),
    ).toBeDefined();
    w.unmount();
  });

  it("TimelineItem applies data-status", () => {
    const w = mountTimeline();
    expect(
      w.find('[data-slot="timeline-item"]').attributes("data-status"),
    ).toBeDefined();
    w.unmount();
  });

  it('TimelineMedia renders with data-slot="timeline-media"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-media"]').exists()).toBe(true);
    w.unmount();
  });

  it('TimelineContent renders with data-slot="timeline-content"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-content"]').exists()).toBe(true);
    w.unmount();
  });

  it('TimelineTitle renders with data-slot="timeline-title"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-title"]').exists()).toBe(true);
    w.unmount();
  });

  it('TimelineDescription renders with data-slot="timeline-description"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-description"]').exists()).toBe(true);
    w.unmount();
  });

  it('TimelineDate renders with data-slot="timeline-date"', () => {
    const w = mountTimeline();
    expect(w.find('[data-slot="timeline-date"]').exists()).toBe(true);
    w.unmount();
  });

  it("TimelineDate renders a time element", () => {
    const w = mountTimeline();
    expect(w.find('time[data-slot="timeline-date"]').exists()).toBe(true);
    w.unmount();
  });

  it("TimelineTitle renders as h3 by default", () => {
    const w = mountTimeline();
    expect(w.find('h3[data-slot="timeline-title"]').exists()).toBe(true);
    w.unmount();
  });
});
