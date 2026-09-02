import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Preloader.module.css";

export interface PreloaderProps {
  /**
   * The name displayed beneath the counter.
   * Defaults to "SEANN TAMONDONG".
   */
  name?: string;
  /**
   * Duration in ms for the counter to reach 100.
   * Defaults to 2800ms.
   */
  countDuration?: number;
  /**
   * Hold time in ms after counter reaches 100 before exit begins.
   * Defaults to 400ms.
   */
  holdDuration?: number;
  /**
   * Exit transition duration in ms.
   * Defaults to 650ms.
   */
  exitDuration?: number;
  /**
   * Callback fired when the preloader begins its exit transition (curtain slide-up).
   */
  onStartExit?: () => void;
  /**
   * Callback fired when the preloader has completely finished and unmounted.
   */
  onComplete?: () => void;
  /**
   * Optional custom CSS class name for the root container.
   */
  className?: string;
}

/**
 * Editorial Preloader — "Counter" Design
 *
 * A cinematic counter (00 → 100) with a synchronized horizontal line
 * and the name in spaced uppercase. Minimal, editorial, refined.
 */
export const Preloader: React.FC<PreloaderProps> = ({
  name = "SEANN TAMONDONG",
  countDuration = 2800,
  holdDuration = 400,
  exitDuration = 650,
  onStartExit,
  onComplete,
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const completeRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Safe completion trigger
  const handleFinish = useCallback(() => {
    if (completeRef.current) return;
    completeRef.current = true;
    setIsDone(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  // Animated counter using requestAnimationFrame with ease-out curve
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const rawProgress = Math.min(elapsed / countDuration, 1);

      // Ease-out cubic for decelerating count (fast start, slow end)
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const currentCount = Math.round(eased * 100);

      setCount(currentCount);

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [countDuration]);

  // Lifecycle timers: hold → exit → complete
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      if (onStartExit) {
        onStartExit();
      }
    }, countDuration + holdDuration);

    const finishTimer = setTimeout(() => {
      handleFinish();
    }, countDuration + holdDuration + exitDuration);

    // Failsafe
    const failsafeTimer = setTimeout(() => {
      handleFinish();
    }, 6000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
      clearTimeout(failsafeTimer);
    };
  }, [countDuration, holdDuration, exitDuration, handleFinish]);

  if (isDone) {
    return null;
  }

  const progressFraction = count / 100;

  return (
    <aside
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className={`${styles.preloader} ${isExiting ? styles.preloaderExiting : ""} ${className}`}
    >
      {/* Screen Reader Announcement */}
      <span className="sr-only">
        Loading portfolio for {name}
      </span>

      {/* Ambient Glow */}
      <div className={styles.ambientBackground} aria-hidden="true" />

      {/* Corner Editorial Details */}
      <span className={`${styles.cornerMark} ${styles.cornerTopLeft}`}>
        PORTFOLIO
      </span>
      <span className={`${styles.cornerMark} ${styles.cornerTopRight}`}>
        <span className={styles.statusDot} aria-hidden="true" />
        <span>LOADING</span>
      </span>
      <span className={`${styles.cornerMark} ${styles.cornerBottomLeft}`}>
        {name} / 2026
      </span>
      <span className={`${styles.cornerMark} ${styles.cornerBottomRight}`}>
        FOLIO—01
      </span>

      {/* Central Content */}
      <div className={styles.content} aria-hidden="true">
        {/* Large Counter */}
        <span className={styles.counter}>
          {String(count).padStart(2, "0")}
        </span>

        {/* Expanding Line */}
        <div className={styles.dividerTrack}>
          <div
            className={styles.dividerFill}
            style={{ transform: `scaleX(${progressFraction})` }}
          />
        </div>

        {/* Name */}
        <span className={styles.nameLabel}>{name}</span>
      </div>
    </aside>
  );
};

export default Preloader;
