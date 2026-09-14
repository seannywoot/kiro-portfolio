import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Services.module.css";

export interface ServicesProps {
  className?: string;
}

interface ServiceItem {
  id: string;
  title: string;
  asset?: {
    src: string;
    side: "left" | "right";
    alt: string;
  };
}

const servicesList: ServiceItem[] = [
  {
    id: "01",
    title: "UI/UX DESIGN",
    asset: {
      src: "/Services%203D%20ASSETS/UI%20UX/Figma%20Right.png",
      side: "right",
      alt: "Figma 3D Asset",
    },
  },
  {
    id: "02",
    title: "WEBSITE DESIGN",
    asset: {
      src: "/Services%203D%20ASSETS/WEBSITE%20DESIGN/webflow%20left%20.png",
      side: "left",
      alt: "Webflow 3D Asset",
    },
  },
  {
    id: "03",
    title: "WEB DEVELOPMENT",
    asset: {
      src: "/Services%203D%20ASSETS/WEB%20DEV/Next.png",
      side: "right",
      alt: "Next.js 3D Asset",
    },
  },
  {
    id: "04",
    title: "VIDEO EDITING",
    asset: {
      src: "/Services%203D%20ASSETS/VIDEO%20EDITING/Davinci.png",
      side: "left",
      alt: "DaVinci Resolve 3D Asset",
    },
  },
  {
    id: "05",
    title: "GRAPHIC DESIGN",
    asset: {
      src: "/Services%203D%20ASSETS/GRAPHIC%20DESIGNER/Photoshop.png",
      side: "right",
      alt: "Photoshop 3D Asset",
    },
  },
];

export const Services: React.FC<ServicesProps> = ({ className = "" }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rowHeight, setRowHeight] = useState(110);

  const [firstIconVisible, setFirstIconVisible] = useState(false);
  const firstIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastWidthRef = useRef<number>(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  // Preload all 3D service assets on mount for seamless, stutter-free scroll transitions
  useEffect(() => {
    servicesList.forEach((service) => {
      if (service.asset?.src) {
        const img = new Image();
        img.src = service.asset.src;
      }
    });
  }, []);

  // Measure row height responsively, avoiding forced re-renders from mobile address bar resize
  useEffect(() => {
    const updateDimensions = () => {
      const currentWidth = window.innerWidth;
      const isMobile = currentWidth < 768;
      const vh = window.innerHeight || 800;
      const calculatedHeight = isMobile
        ? Math.max(70, Math.min(88, vh * 0.1))
        : Math.max(95, Math.min(125, vh * 0.12));
      setRowHeight(calculatedHeight);
      lastWidthRef.current = currentWidth;
    };

    updateDimensions();

    const handleResize = () => {
      // Only recalculate if viewport width actually changed (rotation / devtools resize),
      // ignoring address bar show/hide which only changes innerHeight
      if (Math.abs(window.innerWidth - lastWidthRef.current) > 5) {
        updateDimensions();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (firstIconTimerRef.current) {
        clearTimeout(firstIconTimerRef.current);
      }
    };
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

    // Distribute scroll dwell equally across all services so items 01 and 05 don't abruptly exit
    const numServices = servicesList.length;
    const computedIndex = Math.min(
      numServices - 1,
      Math.max(0, Math.floor(progress * numServices))
    );

    setActiveIndex(computedIndex);

    // Late introduce the first service icon so it's not visible early
    if (rect.top > 80) {
      // User has scrolled back up into Hero; reset first icon visibility
      if (firstIconTimerRef.current) {
        clearTimeout(firstIconTimerRef.current);
        firstIconTimerRef.current = null;
      }
      setFirstIconVisible(false);
    } else if (rect.top <= 0) {
      // Sticky section is pinned / active
      if (scrolled >= 25 || computedIndex > 0) {
        // Scrolled into service or past it: show immediately
        if (firstIconTimerRef.current) {
          clearTimeout(firstIconTimerRef.current);
          firstIconTimerRef.current = null;
        }
        setFirstIconVisible(true);
      } else {
        // Pinned at start of service 01: late introduce with a slight delay
        if (!firstIconTimerRef.current) {
          firstIconTimerRef.current = setTimeout(() => {
            setFirstIconVisible(true);
            firstIconTimerRef.current = null;
          }, 300);
        }
      }
    }
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
    if (index === 0) {
      setFirstIconVisible(true);
    }
    const rect = wrapperRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight || 800;
    const totalScrollable = rect.height - windowHeight;
    // Target the center of the service's scroll zone
    const targetProgress = (index + 0.5) / servicesList.length;
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
              const shouldShowAsset = index !== 0 || firstIconVisible;

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

                        <div className={styles.activeTitleContainer}>
                          {service.asset?.side === "left" && shouldShowAsset && (
                            <div className={styles.assetWrapperLeft}>
                              <img
                                src={service.asset.src}
                                alt={service.asset.alt}
                                className={styles.assetImage}
                              />
                            </div>
                          )}

                          <h2 className={styles.activeTitle}>{service.title}</h2>

                          {service.asset?.side === "right" && shouldShowAsset && (
                            <div className={styles.assetWrapperRight}>
                              <img
                                src={service.asset.src}
                                alt={service.asset.alt}
                                className={styles.assetImage}
                              />
                            </div>
                          )}
                        </div>

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
