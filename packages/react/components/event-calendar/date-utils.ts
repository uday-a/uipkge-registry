import type { CalendarEvent, PositionedEvent } from "./types";

export function parseDate(d: string | Date | undefined | null): Date {
  if (!d) return new Date();
  if (d instanceof Date) return new Date(d.getTime());

  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day, 0, 0, 0);
  }

  // Format: YYYY-MM-DD HH:mm or YYYY-MM-DDTHH:mm
  const matchTime = d.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
  if (matchTime) {
    const [, y, m, day, h, min] = matchTime.map(Number);
    return new Date(y, m - 1, day, h, min, 0);
  }

  const parsed = new Date(d);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

export function formatTime(
  minutes: number,
  format: "12h" | "24h" = "12h",
): string {
  const totalMin = Math.max(0, Math.min(1439, Math.round(minutes)));
  const hour = Math.floor(totalMin / 60);
  const min = totalMin % 60;

  if (format === "24h") {
    return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  }

  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${String(min).padStart(2, "0")} ${ampm}`;
}

export function formatHourLabel(
  hour: number,
  format: "12h" | "24h" = "12h",
): string {
  const normalizedHour = ((hour % 24) + 24) % 24;
  if (format === "24h") {
    return `${String(normalizedHour).padStart(2, "0")}:00`;
  }
  if (normalizedHour === 0) return "12 AM";
  if (normalizedHour === 12) return "12 PM";
  return normalizedHour > 12
    ? `${normalizedHour - 12} PM`
    : `${normalizedHour} AM`;
}

export function getEventMinutes(
  dateInput: string | Date | undefined,
  defaultMinutes: number = 0,
): number {
  if (!dateInput) return defaultMinutes;
  if (dateInput instanceof Date) {
    return dateInput.getHours() * 60 + dateInput.getMinutes();
  }
  if (typeof dateInput === "string") {
    // HH:mm
    if (/^\d{1,2}:\d{2}$/.test(dateInput)) {
      const [h, m] = dateInput.split(":").map(Number);
      return h * 60 + m;
    }
    // Check if contains time
    const parsed = parseDate(dateInput);
    // If input had no time specified (just YYYY-MM-DD), default to defaultMinutes
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
      return defaultMinutes;
    }
    return parsed.getHours() * 60 + parsed.getMinutes();
  }
  return defaultMinutes;
}

export function getWeekDays(baseDate: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const date = parseDate(baseDate);
  const day = date.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  const startOfWeek = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - diff,
  );

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getWorkWeekDays(baseDate: Date): Date[] {
  // Always Monday through Friday
  const date = parseDate(baseDate);
  const day = date.getDay();
  const diff = (day - 1 + 7) % 7; // Monday offset
  const monday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() - diff,
  );

  const days: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getMonthDays(
  cursor: Date,
  weekStartsOn: 0 | 1 = 0,
): { date: Date; dateKey: string; inMonth: boolean; isToday: boolean }[] {
  const y = cursor.getFullYear();
  const m = cursor.getMonth();
  const firstDay = new Date(y, m, 1);
  const offset = (firstDay.getDay() - weekStartsOn + 7) % 7;

  const startDate = new Date(y, m, 1 - offset);
  const days: {
    date: Date;
    dateKey: string;
    inMonth: boolean;
    isToday: boolean;
  }[] = [];

  for (let i = 0; i < 42; i++) {
    const d = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + i,
    );
    days.push({
      date: d,
      dateKey: formatDateKey(d),
      inMonth: d.getMonth() === m,
      isToday: isToday(d),
    });
  }
  return days;
}

export function calculateTimedEventPositions(
  events: CalendarEvent[],
  dayDate: Date,
  firstInterval: number = 0,
  intervalCount: number = 24,
  intervalMinutes: number = 60,
): PositionedEvent[] {
  const dayKey = formatDateKey(dayDate);
  const startDayMinutes = firstInterval * 60;
  const totalMinutes = intervalCount * intervalMinutes;

  // Filter events belonging to this day that are timed
  const timed = events
    .filter((e) => {
      if (e.allDay) return false;
      const sKey =
        typeof e.start === "string" && /^\d{4}-\d{2}-\d{2}/.test(e.start)
          ? e.start.slice(0, 10)
          : formatDateKey(parseDate(e.start));
      return sKey === dayKey;
    })
    .map((event) => {
      const sMin = getEventMinutes(event.start, 9 * 60);
      let eMin = getEventMinutes(event.end, sMin + 60);
      if (eMin <= sMin) eMin = sMin + 30; // minimum 30 min duration
      return {
        event,
        startMinutes: sMin,
        endMinutes: eMin,
      };
    })
    .sort(
      (a, b) =>
        a.startMinutes - b.startMinutes ||
        b.endMinutes - b.startMinutes - (a.endMinutes - a.startMinutes),
    );

  if (timed.length === 0) return [];

  // Assign columns for overlapping groups
  const positioned: PositionedEvent[] = [];
  // Cluster overlapping events
  type ClusterItem = {
    event: CalendarEvent;
    startMinutes: number;
    endMinutes: number;
    col: number;
  };
  const clusters: ClusterItem[][] = [];
  let currentCluster: ClusterItem[] = [];
  let clusterEnd = -1;

  for (const item of timed) {
    if (currentCluster.length === 0 || item.startMinutes < clusterEnd) {
      currentCluster.push({ ...item, col: 0 });
      clusterEnd = Math.max(clusterEnd, item.endMinutes);
    } else {
      clusters.push(currentCluster);
      currentCluster = [{ ...item, col: 0 }];
      clusterEnd = item.endMinutes;
    }
  }
  if (currentCluster.length > 0) {
    clusters.push(currentCluster);
  }

  // For each cluster, assign columns
  for (const cluster of clusters) {
    const cols: number[] = []; // end time of each column
    for (const item of cluster) {
      let placedCol = -1;
      for (let c = 0; c < cols.length; c++) {
        if (item.startMinutes >= cols[c]) {
          placedCol = c;
          cols[c] = item.endMinutes;
          break;
        }
      }
      if (placedCol === -1) {
        placedCol = cols.length;
        cols.push(item.endMinutes);
      }
      item.col = placedCol;
    }

    const totalCols = Math.max(1, cols.length);
    for (const item of cluster) {
      const topPct = Math.max(
        0,
        Math.min(
          100,
          ((item.startMinutes - startDayMinutes) / totalMinutes) * 100,
        ),
      );
      const bottomPct = Math.max(
        0,
        Math.min(
          100,
          ((item.endMinutes - startDayMinutes) / totalMinutes) * 100,
        ),
      );
      const heightPct = Math.max(1.5, bottomPct - topPct);
      const widthPct = 100 / totalCols;
      const leftPct = item.col * widthPct;

      positioned.push({
        event: item.event,
        top: topPct,
        height: heightPct,
        left: leftPct,
        width: widthPct,
        startMinutes: item.startMinutes,
        endMinutes: item.endMinutes,
      });
    }
  }

  return positioned;
}

export function getCurrentTimePosition(
  firstInterval: number = 0,
  intervalCount: number = 24,
  intervalMinutes: number = 60,
): number | null {
  const now = new Date();
  const curMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = firstInterval * 60;
  const totalMinutes = intervalCount * intervalMinutes;

  if (curMinutes < startMinutes || curMinutes > startMinutes + totalMinutes) {
    return null;
  }
  return ((curMinutes - startMinutes) / totalMinutes) * 100;
}
