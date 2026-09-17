"use client";

import * as React from "react";
import type { LoadingBarHandle } from "./LoadingBar";

export type { LoadingBarHandle };

/**
 * Hook that drives a <LoadingBar> instance via a ref callback.
 *
 * Usage:
 *   const bar = useLoadingBar()
 *   <LoadingBar ref={bar.setRef} />
 *   bar.start()
 *   await fetch(...)
 *   bar.finish()
 */
export function useLoadingBar() {
  const handleRef = React.useRef<LoadingBarHandle | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const setRef = React.useCallback((el: LoadingBarHandle | null) => {
    handleRef.current = el;
  }, []);

  function start(from = 20) {
    setIsError(false);
    setLoading(true);
    handleRef.current?.start(from);
  }

  function finish() {
    setLoading(false);
    handleRef.current?.finish();
  }

  function error() {
    setIsError(true);
    setLoading(false);
    handleRef.current?.error();
  }

  function inc(amount = 10) {
    handleRef.current?.inc(amount);
  }

  function set(value: number) {
    handleRef.current?.set(value);
  }

  return {
    setRef,
    loading,
    isError,
    start,
    finish,
    error,
    inc,
    set,
  };
}
