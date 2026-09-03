import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useDebouncedInput } from "./use-debounced.hook";

describe("useDebouncedInput", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebouncedInput("hello", vi.fn()));
    expect(result.current[0]).toBe("hello");
  });

  it("updates local value synchronously on setValue", () => {
    const { result } = renderHook(() => useDebouncedInput("hello", vi.fn()));

    act(() => {
      result.current[1]("world");
    });

    expect(result.current[0]).toBe("world");
  });

  it("does not call onChange before the delay elapses", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("hello", onChange, 300));

    act(() => {
      result.current[1]("world");
    });
    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls onChange with the latest value after the delay elapses", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("hello", onChange, 300));

    act(() => {
      result.current[1]("world");
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("world");
  });

  it("resets the timer on rapid successive updates, only firing once for the last value", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useDebouncedInput("hello", onChange, 300));

    act(() => {
      result.current[1]("w");
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      result.current[1]("wo");
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(onChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(onChange).toHaveBeenCalledExactlyOnceWith("wo");
  });

  it("always uses the latest onChange reference, even without a value change", () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    const { result, rerender } = renderHook(
      ({ onChange }) => useDebouncedInput("hello", onChange, 300),
      { initialProps: { onChange: firstOnChange } },
    );

    act(() => {
      result.current[1]("world");
    });
    rerender({ onChange: secondOnChange });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(firstOnChange).not.toHaveBeenCalled();
    expect(secondOnChange).toHaveBeenCalledExactlyOnceWith("world");
  });

  it("clears the pending timeout on unmount", () => {
    const onChange = vi.fn();
    const { result, unmount } = renderHook(() => useDebouncedInput("hello", onChange, 300));

    act(() => {
      result.current[1]("world");
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
