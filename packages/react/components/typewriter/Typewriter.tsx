"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** A single phrase or a list cycled type -> pause -> delete -> next. */
  phrases: string | string[];
  /** Milliseconds per typed character. */
  typingSpeed?: number;
  /** Milliseconds per deleted character. */
  deletingSpeed?: number;
  /** Milliseconds a completed phrase holds before deleting. */
  pause?: number;
  /** Milliseconds before the first character types. */
  startDelay?: number;
  /** When false, stops after fully typing the last phrase (caret keeps blinking). */
  loop?: boolean;
  showCaret?: boolean;
}

const Typewriter = React.forwardRef<HTMLSpanElement, TypewriterProps>(
  (
    {
      className,
      phrases,
      typingSpeed = 45,
      deletingSpeed = 25,
      pause = 1600,
      startDelay = 0,
      loop = true,
      showCaret = true,
      ...props
    },
    ref,
  ) => {
    const list = React.useMemo(
      () => (Array.isArray(phrases) ? phrases : [phrases]),
      [phrases],
    );
    const srText = React.useMemo(() => list.join(". "), [list]);

    // Starts empty on server AND client first paint; sequencing begins in this
    // effect only, so SSR markup and hydration output always match.
    const [text, setText] = React.useState("");
    const [reduced, setReduced] = React.useState(false);

    React.useEffect(() => {
      const isReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      setReduced(isReduced);
      if (isReduced) {
        // Skip the animation entirely: render the phrase in full with a static caret.
        setText(list[0] ?? "");
        return;
      }

      let timer: ReturnType<typeof setTimeout> | undefined;
      let index = 0;
      let chars = 0;
      let deleting = false;

      const clear = () => {
        if (timer !== undefined) clearTimeout(timer);
        timer = undefined;
      };

      const schedule = (fn: () => void, delay: number) => {
        clear();
        timer = setTimeout(() => {
          timer = undefined;
          fn();
        }, delay);
      };

      const step = () => {
        const current = list[index] ?? "";
        if (!deleting) {
          chars += 1;
          setText(current.slice(0, chars));
          if (chars < current.length) {
            schedule(step, typingSpeed);
          } else if (loop || index < list.length - 1) {
            schedule(() => {
              deleting = true;
              step();
            }, pause);
          }
          // loop=false on the last phrase: stop here; the caret keeps blinking.
        } else {
          chars -= 1;
          setText(current.slice(0, chars));
          if (chars > 0) {
            schedule(step, deletingSpeed);
          } else {
            deleting = false;
            index = (index + 1) % list.length;
            step();
          }
        }
      };

      if (startDelay > 0) schedule(step, startDelay);
      else step();

      return clear;
    }, [list, typingSpeed, deletingSpeed, pause, startDelay, loop]);

    return (
      <span
        ref={ref}
        data-uipkge=""
        data-slot="typewriter"
        className={cn(className)}
        {...props}
      >
        <span className="sr-only">{srText}</span>
        <span aria-hidden="true" className="whitespace-pre-wrap">
          <span>{text}</span>
          {showCaret && (
            <span
              className={cn(
                "inline-block h-[1em] w-[0.5ch] bg-current align-baseline",
                !reduced && "animate-caret-blink",
              )}
            />
          )}
        </span>
      </span>
    );
  },
);

Typewriter.displayName = "Typewriter";

export { Typewriter };
