import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Preloader } from "../Preloader";

describe("Preloader Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame for counter animation
    let frameId = 0;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      frameId++;
      setTimeout(() => cb(performance.now()), 16);
      return frameId;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the counter, name, and accessible elements", () => {
    render(<Preloader name="SEANN TAMONDONG" />);

    // Check accessible role & live region
    const statusRegion = screen.getByRole("status");
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute("aria-live", "polite");

    // Check screen reader announcement
    expect(screen.getByText(/Loading portfolio for SEANN TAMONDONG/i)).toBeInTheDocument();

    // Check name label is rendered
    const nameElements = screen.getAllByText("SEANN TAMONDONG");
    expect(nameElements.length).toBeGreaterThanOrEqual(1);

    // Check counter starts at "00"
    expect(screen.getByText("00")).toBeInTheDocument();
  });

  it("calls onComplete and unmounts after duration sequence finishes", () => {
    const handleComplete = vi.fn();
    const { container } = render(
      <Preloader
        name="SEANN TAMONDONG"
        countDuration={1000}
        holdDuration={200}
        exitDuration={300}
        onComplete={handleComplete}
      />
    );

    expect(container.firstChild).not.toBeNull();

    // Advance to exit phase (1000 + 200 = 1200ms)
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(handleComplete).not.toHaveBeenCalled();

    // Advance to finish phase (1200 + 300 = 1500ms)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
    expect(container.firstChild).toBeNull();
  });

  it("triggers failsafe if duration exceeds maximum threshold", () => {
    const handleComplete = vi.fn();
    render(
      <Preloader
        name="SEANN TAMONDONG"
        countDuration={8000} // abnormally long
        onComplete={handleComplete}
      />
    );

    // Fast-forward past 6000ms failsafe
    act(() => {
      vi.advanceTimersByTime(6050);
    });

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });
});
