import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDelayedRedirect } from "@/hooks/useDelayedRedirect";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useDelayedRedirect", () => {
  it("does not navigate while inactive", () => {
    const navigate = vi.fn();
    renderHook(() => useDelayedRedirect(navigate, false));
    vi.advanceTimersByTime(5000);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("navigates to the default target after the default delay once active", () => {
    const navigate = vi.fn();
    renderHook(() => useDelayedRedirect(navigate, true));
    vi.advanceTimersByTime(1999);
    expect(navigate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(navigate).toHaveBeenCalledWith({ to: "/" });
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  it("respects a custom target and delay", () => {
    const navigate = vi.fn();
    renderHook(() => useDelayedRedirect(navigate, true, "/dashboard", 500));
    vi.advanceTimersByTime(499);
    expect(navigate).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(navigate).toHaveBeenCalledWith({ to: "/dashboard" });
  });

  it("clears the timer on unmount, so navigate never fires against an unmounted component", () => {
    const navigate = vi.fn();
    const { unmount } = renderHook(() => useDelayedRedirect(navigate, true));
    unmount();
    vi.advanceTimersByTime(10_000);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("clears the pending timer if active flips back to false before it fires", () => {
    const navigate = vi.fn();
    const { rerender } = renderHook(({ active }) => useDelayedRedirect(navigate, active), {
      initialProps: { active: true },
    });
    vi.advanceTimersByTime(1000);
    rerender({ active: false });
    vi.advanceTimersByTime(5000);
    expect(navigate).not.toHaveBeenCalled();
  });
});
