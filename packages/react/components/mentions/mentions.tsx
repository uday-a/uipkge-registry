"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { getCaretRect, type CaretRect } from "./caret-position";

export interface MentionOption {
  value: string;
  label: string;
  description?: string;
  avatar?: string;
  email?: string;
  handle?: string;
  bio?: string;
  joined?: string;
  following?: number | string;
  followers?: number | string;
  verified?: boolean;
  disabled?: boolean;
  [key: string]: any;
}

export interface MentionsProps<O extends MentionOption = MentionOption> {
  /** Controlled textarea value. */
  value?: string;
  /** Fires with the next textarea value on every input + on insert. */
  onValueChange?: (value: string) => void;
  options?: O[] | Record<string, O[]>;
  triggers?: string[];
  triggerPrefixes?: Record<string, string>;
  prefix?: string;
  rows?: number;
  loading?: boolean;
  loadOptions?: (query: string, trigger: string) => Promise<O[]>;
  format?: (option: O, trigger: string) => string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  /** Fires when an option is committed into the text. */
  onSelect?: (option: O) => void;
  /** Fires whenever the active mention query changes. */
  onSearch?: (payload: { trigger: string; query: string }) => void;
}

function MentionsInner<O extends MentionOption = MentionOption>(
  {
    value = "",
    onValueChange,
    options = [] as unknown as O[],
    triggers = ["@"],
    triggerPrefixes,
    prefix = "@",
    rows = 4,
    loading = false,
    loadOptions,
    format,
    placeholder = "",
    disabled = false,
    readOnly = false,
    className,
    onSelect,
    onSearch,
  }: MentionsProps<O>,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);
  const setRefs = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref)
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
    },
    [ref],
  );

  const [open, setOpen] = React.useState(false);
  const [activeTrigger, setActiveTrigger] = React.useState("");
  const [query, setQuery] = React.useState("");
  const [triggerIndex, setTriggerIndex] = React.useState(-1);
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [asyncResults, setAsyncResults] = React.useState<O[]>([]);
  const [isAsyncLoading, setIsAsyncLoading] = React.useState(false);
  const [caretRect, setCaretRect] = React.useState<CaretRect | null>(null);
  const listboxId = React.useId();
  const optionId = (i: number) => `${listboxId}-opt-${i}`;

  const currentOptionsList = React.useMemo<O[]>(() => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    if (typeof options === "object") {
      return (options as Record<string, O[]>)[activeTrigger] ?? [];
    }
    return [];
  }, [options, activeTrigger]);

  const filtered = React.useMemo<O[]>(() => {
    if (loadOptions) return asyncResults;
    const source = currentOptionsList;
    if (!query) return source;
    const q = query.toLowerCase();
    return source.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q) ||
        (o.email && o.email.toLowerCase().includes(q)),
    );
  }, [loadOptions, asyncResults, query, currentOptionsList]);

  const totalLoading = loading || isAsyncLoading;

  function firstEnabledIndex(list: O[] = filtered) {
    const i = list.findIndex((o) => !o.disabled);
    return i === -1 ? 0 : i;
  }

  function moveHighlight(delta: number) {
    const len = filtered.length;
    if (len === 0) return;
    setHighlightedIndex((current) => {
      let i = current;
      for (let n = 0; n < len; n++) {
        i = (i + delta + len) % len;
        if (!filtered[i]?.disabled) {
          const opt = document.getElementById(optionId(i));
          opt?.scrollIntoView({ block: "nearest" });
          return i;
        }
      }
      return current;
    });
  }

  function findActiveMention(
    val: string,
    caret: number,
  ): { trigger: string; index: number; query: string } | null {
    for (let i = caret - 1; i >= 0; i--) {
      const ch = val[i]!;
      if (triggers.includes(ch)) {
        const before = i === 0 ? "" : val[i - 1]!;
        if (i === 0 || /\s/.test(before)) {
          return { trigger: ch, index: i, query: val.substring(i + 1, caret) };
        }
        return null;
      }
      if (/\s/.test(ch)) return null;
    }
    return null;
  }

  const updateAnchor = React.useCallback(() => {
    const ta = innerRef.current;
    if (!ta) return;
    setCaretRect(getCaretRect(ta, ta.selectionStart ?? 0));
  }, []);

  const asyncTokenRef = React.useRef(0);
  const runAsync = React.useCallback(
    async (trigger: string, q: string) => {
      if (!loadOptions) return;
      const token = ++asyncTokenRef.current;
      setIsAsyncLoading(true);
      try {
        const results = await loadOptions(q, trigger);
        if (token === asyncTokenRef.current) setAsyncResults(results);
      } finally {
        if (token === asyncTokenRef.current) setIsAsyncLoading(false);
      }
    },
    [loadOptions],
  );

  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const scheduleAsync = React.useCallback(
    (trigger: string, q: string) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => runAsync(trigger, q), 200);
    },
    [runAsync],
  );

  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  function onInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    onValueChange?.(next);
    const match = findActiveMention(next, e.target.selectionStart ?? 0);
    if (match) {
      setOpen(true);
      setActiveTrigger(match.trigger);
      setTriggerIndex(match.index);
      setQuery(match.query);
      onSearch?.({ trigger: match.trigger, query: match.query });
      if (loadOptions) scheduleAsync(match.trigger, match.query);
      requestAnimationFrame(updateAnchor);
    } else {
      setOpen(false);
    }
  }

  function defaultFormat(option: O, trigger: string) {
    const resolvedPrefix =
      triggerPrefixes?.[trigger] ?? trigger ?? prefix ?? "@";
    return `${resolvedPrefix}${option.value} `;
  }

  function insert(option: O) {
    const ta = innerRef.current;
    if (!ta) return;
    const caret = ta.selectionStart ?? 0;
    const before = value.substring(0, triggerIndex);
    const after = value.substring(caret);
    const token = (format ?? defaultFormat)(option, activeTrigger);
    const next = before + token + after;
    onValueChange?.(next);
    onSelect?.(option);
    setOpen(false);
    requestAnimationFrame(() => {
      const pos = before.length + token.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveHighlight(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      moveHighlight(-1);
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const opt = filtered[highlightedIndex];
      if (opt && !opt.disabled) insert(opt);
    }
  }

  const anchorStyle: React.CSSProperties = React.useMemo(() => {
    if (!caretRect) return { display: "none" };
    return {
      position: "fixed",
      top: `${caretRect.top + caretRect.height}px`,
      left: `${caretRect.left}px`,
      width: "0px",
      height: "0px",
      pointerEvents: "none",
    };
  }, [caretRect]);

  return (
    <div
      className={cn("relative w-full", className)}
      data-uipkge
      data-slot="mentions"
    >
      <textarea
        ref={setRefs}
        value={value}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        role="combobox"
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && filtered.length > 0 ? optionId(highlightedIndex) : undefined
        }
        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-16 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        onChange={onInput}
        onKeyDown={onKeyDown}
        onScroll={updateAnchor}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div style={anchorStyle} aria-hidden="true" />
        </PopoverAnchor>
        <PopoverContent
          align="start"
          sideOffset={4}
          className="border-border/80 w-64 rounded-lg p-1 shadow-md"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div id={listboxId}>
            {totalLoading ? (
              <div
                className="text-muted-foreground px-2 py-3 text-sm"
                role="status"
              >
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div
                className="text-muted-foreground px-2 py-3 text-sm"
                role="status"
              >
                No matches
              </div>
            ) : (
              <ul
                className="max-h-64 overflow-auto"
                role="listbox"
                aria-label="Mentions"
              >
                {filtered.map((opt, i) => {
                  const active = i === highlightedIndex;
                  return (
                    <li
                      key={opt.value}
                      id={optionId(i)}
                      role="option"
                      aria-selected={active}
                      aria-disabled={opt.disabled || undefined}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        active && !opt.disabled
                          ? "bg-accent text-accent-foreground"
                          : "",
                        opt.disabled ? "cursor-not-allowed opacity-50" : "",
                      )}
                      onMouseEnter={() =>
                        !opt.disabled && setHighlightedIndex(i)
                      }
                      onMouseDown={(e) => {
                        e.preventDefault();
                        if (!opt.disabled) insert(opt);
                      }}
                    >
                      {opt.avatar && (
                        <img
                          src={opt.avatar}
                          alt=""
                          className="size-6 rounded-full object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{opt.label}</div>
                        {(opt.description || opt.email) && (
                          <div className="text-muted-foreground truncate text-xs">
                            {opt.description || opt.email}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export const Mentions = React.forwardRef(MentionsInner) as <
  O extends MentionOption = MentionOption,
>(
  props: MentionsProps<O> & { ref?: React.ForwardedRef<HTMLTextAreaElement> },
) => React.ReactElement;

export default Mentions;
