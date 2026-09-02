import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Services.module.css";

export interface ServicesProps {
  className?: string;
}

interface ServiceItem {
  id: string;
  title: string;
}

const servicesList: ServiceItem[] = [
  { id: "01", title: "BRAND STRATEGY" },
  { id: "02", title: "CREATIVE DIRECTION" },
  { id: "03", title: "UI/UX DESIGN" },
  { id: "04", title: "WEBSITE DESIGN" },
  { id: "05", title: "DESIGN SYSTEM" },
  { id: "06", title: "FRONT-END DEVELOPMENT" },
];

export const Services: React.FC<ServicesProps> = ({ className = "" }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(110);

  // Measure row height responsively
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      const vh = window.innerHeight || 800;
      const calculatedHeight = isMobile
        ? Math.max(75, Math.min(95, vh * 0.1))
        : Math.max(95, Math.min(125, vh * 0.12));
      setRowHeight(calculatedHeight);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Handle scroll progress within the sticky section
  const handleScroll = useCallback(() => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || 800;
    const totalScrollable = rect.height - windowHeight;

    if (totalScrollable <= 0) return;

    // Calculate progress (0 when top enters sticky, 1 when reaching end)
    const scrolled = -rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));

    // Compute active index based on scroll progress
    const computedIndex = Math.min(
      servicesList.length - 1,
      Math.max(0, Math.round(progress * (servicesList.length - 1)))
    );

    setActiveIndex(computedIndex);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [handleScroll]);

  // Handle click on a service item to smoothly scroll to it
  const handleItemClick = (index: number) => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || 800;
    const totalScrollable = rect.height - windowHeight;
    const targetProgress = index / (servicesList.length - 1);
    const targetScrollY = window.scrollY + rect.top + targetProgress * totalScrollable;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  };

  // Mathematically precise vertical offset to place the active item at exact vertical center (50%)
  const translateY = -((activeIndex + 0.5) * rowHeight);

  return (
    <div
      ref={wrapperRef}
      id="services"
      className={`${styles.servicesScrollWrapper} ${className}`}
      aria-label="Services Section"
    >
      {/* Sticky Viewport */}
      <div className={styles.servicesSticky}>
        {/* Ambient Top & Bottom Vignette Gradients */}
        <div className={styles.vignetteTop} aria-hidden="true" />
        <div className={styles.vignetteBottom} aria-hidden="true" />

        {/* Centered Drum Container */}
        <div className={styles.drumContainer}>
          <div
            className={styles.drumTrack}
            style={{
              transform: `translateY(${translateY}px)`,
            }}
          >
            {/* Top Header: ▪ SERVICES ▪ (Scrolls with the drum) */}
            <div className={styles.topHeader}>
              <span className={styles.headerDot} aria-hidden="true" />
              <span>SERVICES</span>
              <span className={styles.headerDot} aria-hidden="true" />
            </div>

            {servicesList.map((service, index) => {
              const isActive = index === activeIndex;
              const distanceFromActive = Math.abs(index - activeIndex);

              return (
                <div
                  key={service.id}
                  className={styles.serviceRow}
                  onClick={() => handleItemClick(index)}
                  style={{
                    height: `${rowHeight}px`,
                    /* All service items remain displayed */
                    opacity: isActive ? 1 : Math.max(0.22, 0.48 - distanceFromActive * 0.1),
                    transform: isActive ? "scale(1)" : `scale(${Math.max(0.9, 1 - distanceFromActive * 0.035)})`,
                    transition: "opacity 0.25s ease, transform 0.25s ease",
                  }}
                >
                  {isActive ? (
                    /* Active White Ribbon at exact center */
                    <div className={styles.activeRibbonWrapper}>
                      <div className={styles.activeRibbon}>
                        <div className={`${styles.ribbonSide} ${styles.ribbonSideLeft}`}>
                          <span className={styles.squareDot} />
                          <span className={styles.squareDot} />
                        </div>

                        <h2 className={styles.activeTitle}>{service.title}</h2>

                        <div className={`${styles.ribbonSide} ${styles.ribbonSideRight}`}>
                          <span className={styles.squareDot} />
                          <span className={styles.squareDot} />
                        </div>
                      </div>
                      <div className={styles.ribbonReflection} aria-hidden="true" />
                    </div>
                  ) : (
                    /* Inactive Dark Item with Bracket Index - Remains Displayed */
                    <div className={styles.inactiveItem}>
                      <span className={styles.itemIndex}>[{service.id}]</span>
                      <span className={styles.itemTitle}>{service.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Progress Tracker */}
        <div className={styles.scrollHint} aria-hidden="true">
          <span className={styles.scrollProgressNum}>{servicesList[activeIndex].id}</span>
          <span>/</span>
          <span>0{servicesList.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Services;
