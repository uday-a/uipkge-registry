// Headless month-grid + drag/shift range-select primitives.
// Domain-agnostic: knows nothing about events -- just dates, the 42-cell grid,
// and a normalized [start, end] range driven by mouse / shift-click. Pair with
// EventCalendar (or any month-shaped UI) by reading the returned refs/computeds.

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

export type DateKey = string; // YYYY-MM-DD

export interface UseMonthGridOptions {
  initialDate?: Date | DateKey;
  weekStartsOn?: 0 | 1; // 0 = Sunday (default), 1 = Monday
}

export function isoDate(d: Date): DateKey {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateFromKey(k: DateKey): Date {
  return new Date(k + "T00:00:00");
}

export function dayDiff(a: DateKey, b: DateKey): number {
  return Math.round(
    (dateFromKey(b).getTime() - dateFromKey(a).getTime()) / 86400000,
  );
}

export function useMonthGrid(options: UseMonthGridOptions = {}) {
  const weekStartsOn = options.weekStartsOn ?? 0;
  const init = options.initialDate
    ? typeof options.initialDate === "string"
      ? dateFromKey(options.initialDate)
      : options.initialDate
    : new Date();

  // "today" is frozen to the moment the composable is created -- predictable for tests / SSR.
  const today = new Date(init.getFullYear(), init.getMonth(), init.getDate());
  const todayKey = isoDate(today);

  const cursor = ref(new Date(init.getFullYear(), init.getMonth(), 1));

  const rangeAnchor = ref<DateKey>(todayKey);
  const rangeStart = ref<DateKey>(todayKey);
  const rangeEnd = ref<DateKey>(todayKey);
  const isDragging = ref(false);

  const monthLabel = computed(() =>
    cursor.value.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  );

  const gridDays = computed(() => {
    const first = new Date(
      cursor.value.getFullYear(),
      cursor.value.getMonth(),
      1,
    );
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - offset);
    const days: { date: Date; key: DateKey; inMonth: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push({
        date: d,
        key: isoDate(d),
        inMonth: d.getMonth() === cursor.value.getMonth(),
      });
    }
    return days;
  });

  const weekdays = computed(() => {
    const base = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return [...base.slice(weekStartsOn), ...base.slice(0, weekStartsOn)];
  });

  const rangeBounds = computed(() => {
    const a = rangeStart.value;
    const b = rangeEnd.value;
    return a <= b ? { lo: a, hi: b } : { lo: b, hi: a };
  });

  const rangeDayCount = computed(
    () => dayDiff(rangeBounds.value.lo, rangeBounds.value.hi) + 1,
  );
  const isRange = computed(() => rangeBounds.value.lo !== rangeBounds.value.hi);

  function inRange(key: DateKey) {
    const { lo, hi } = rangeBounds.value;
    return key >= lo && key <= hi;
  }

  function prevMonth() {
    cursor.value = new Date(
      cursor.value.getFullYear(),
      cursor.value.getMonth() - 1,
      1,
    );
  }
  function nextMonth() {
    cursor.value = new Date(
      cursor.value.getFullYear(),
      cursor.value.getMonth() + 1,
      1,
    );
  }
  function goToToday() {
    cursor.value = new Date(today.getFullYear(), today.getMonth(), 1);
    rangeAnchor.value = todayKey;
    rangeStart.value = todayKey;
    rangeEnd.value = todayKey;
  }
  function selectDay(key: DateKey) {
    rangeAnchor.value = key;
    rangeStart.value = key;
    rangeEnd.value = key;
  }
  function selectWeekOf(key: DateKey) {
    const d = dateFromKey(key);
    const dow = (d.getDay() - weekStartsOn + 7) % 7;
    const wkStart = new Date(d);
    wkStart.setDate(d.getDate() - dow);
    const wkEnd = new Date(wkStart);
    wkEnd.setDate(wkStart.getDate() + 6);
    rangeAnchor.value = isoDate(wkStart);
    rangeStart.value = isoDate(wkStart);
    rangeEnd.value = isoDate(wkEnd);
  }
  function clearRange() {
    rangeAnchor.value = todayKey;
    rangeStart.value = todayKey;
    rangeEnd.value = todayKey;
  }

  function onCellMouseDown(key: DateKey, ev: MouseEvent) {
    if (ev.button !== 0) return; // ignore right-click -- context menus handle it
    if (ev.shiftKey) {
      rangeEnd.value = key;
      return;
    }
    rangeAnchor.value = key;
    rangeStart.value = key;
    rangeEnd.value = key;
    isDragging.value = true;
  }
  function onCellMouseEnter(key: DateKey) {
    if (!isDragging.value) return;
    rangeEnd.value = key;
    rangeStart.value = rangeAnchor.value;
  }
  function endDrag() {
    if (isDragging.value) isDragging.value = false;
  }

  // Window listeners are needed because mouseup can fire outside any cell.
  // Guarded for SSR -- only registers on the client.
  if (typeof window !== "undefined") {
    onMounted(() => {
      window.addEventListener("mouseup", endDrag);
      window.addEventListener("mouseleave", endDrag);
    });
    onBeforeUnmount(() => {
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("mouseleave", endDrag);
    });
  }

  return {
    today,
    todayKey,
    cursor,
    monthLabel,
    gridDays,
    weekdays,
    rangeAnchor,
    rangeStart,
    rangeEnd,
    rangeBounds,
    rangeDayCount,
    isRange,
    isDragging,
    inRange,
    prevMonth,
    nextMonth,
    goToToday,
    selectDay,
    selectWeekOf,
    clearRange,
    onCellMouseDown,
    onCellMouseEnter,
    endDrag,
  };
}
