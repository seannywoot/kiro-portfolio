import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import CropIndicator from "./CropIndicator";

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener("change", handler)
      );
  }, [queries]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

interface Item {
  id: string;
  img: string;
  url: string;
  height: number;
  title?: string;
  showCropIndicator?: boolean;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "bottom" | "top" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  enableExpansion?: boolean;
  expansionScale?: number;
  expansionDuration?: number;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = false, // Disable default scaling for expansion
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  enableExpansion = true,
  expansionScale = 1.15,
  expansionDuration = 0.4,
}) => {
  const columns = useMedia(
    [
      "(min-width:1500px)",
      "(min-width:1000px)",
      "(min-width:600px)",
      "(min-width:400px)",
    ],
    [5, 4, 3, 2],
    1
  );
  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const expansionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getInitialPosition = (item: any) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === "random") {
      const dirs = ["top", "bottom", "left", "right"];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case "top":
        return { x: item.x, y: -200 };
      case "bottom":
        return { x: item.x, y: window.innerHeight + 200 };
      case "left":
        return { x: -200, y: item.y };
      case "right":
        return { x: window.innerWidth + 200, y: item.y };
      case "center":
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo(() => {
    if (!width) return [];
    const colHeights = new Array(columns).fill(0);
    const gap = 16;
    const totalGaps = (columns - 1) * gap;
    const columnWidth = (width - totalGaps) / columns;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const height = child.height / 2;
      const y = colHeights[col];
      colHeights[col] += height + gap;
      return { ...child, x, y, w: columnWidth, h: height };
    });
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: "blur(10px)" }),
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.8,
            ease: "power3.out",
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease, getInitialPosition]);

  const handleMouseEnter = (id: string, element: HTMLElement, item: Item) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }

    // Handle expansion
    if (enableExpansion) {
      // Clear any existing timeout
      if (expansionTimeoutRef.current) {
        clearTimeout(expansionTimeoutRef.current);
      }

      expansionTimeoutRef.current = setTimeout(() => {
        setExpandedItem(id);
        
        // Animate expansion
        const cardElement = element.querySelector('.masonry-card') as HTMLElement;
        const imageElement = element.querySelector('.masonry-image') as HTMLElement;
        
        if (cardElement && imageElement) {
          // Bring to front
          gsap.set(element, { zIndex: 100 });
          
          // Expand the card
          gsap.to(cardElement, {
            scale: expansionScale,
            duration: expansionDuration,
            ease: "power2.out",
            transformOrigin: "center center",
          });

          // Change background-size to contain to show full image
          gsap.to(imageElement, {
            backgroundSize: "contain",
            duration: expansionDuration,
            ease: "power2.out",
          });

          // Add subtle shadow enhancement
          gsap.to(cardElement, {
            boxShadow: "0px 25px 80px -10px rgba(0,0,0,0.4)",
            duration: expansionDuration,
            ease: "power2.out",
          });
        }
      }, 300); // Small delay before expansion
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector(".color-overlay") as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }

    // Handle expansion cleanup
    if (enableExpansion) {
      // Clear timeout
      if (expansionTimeoutRef.current) {
        clearTimeout(expansionTimeoutRef.current);
        expansionTimeoutRef.current = null;
      }

      // If this item was expanded, contract it
      if (expandedItem === id) {
        setExpandedItem(null);
        
        const cardElement = element.querySelector('.masonry-card') as HTMLElement;
        const imageElement = element.querySelector('.masonry-image') as HTMLElement;
        
        if (cardElement && imageElement) {
          // Contract the card
          gsap.to(cardElement, {
            scale: 1,
            duration: expansionDuration * 0.8, // Slightly faster contraction
            ease: "power2.out",
            boxShadow: "0px 10px 50px -10px rgba(0,0,0,0.2)", // Reset shadow
          });

          // Reset background-size to cover
          gsap.to(imageElement, {
            backgroundSize: "cover",
            duration: expansionDuration * 0.8,
            ease: "power2.out",
          });

          // Reset z-index after animation
          gsap.set(element, { 
            zIndex: 1,
            delay: expansionDuration * 0.8
          });
        }
      }
    }
  };

  // Remove mouse move handler as we don't need it for expansion

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (expansionTimeoutRef.current) {
        clearTimeout(expansionTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
    >
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer group masonry-item"
          style={{ 
            willChange: "transform, width, height, opacity",
            zIndex: expandedItem === item.id ? 100 : 1,
          }}
          tabIndex={0}
          role="button"
          aria-label={`View ${item.title || `project ${item.id}`} details`}
          onClick={(e) => {
            // Let parent components handle the click event
            e.stopPropagation();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.currentTarget.click();
            }
          }}
          onMouseEnter={(e) => handleMouseEnter(item.id, e.currentTarget, item)}
          onMouseLeave={(e) => handleMouseLeave(item.id, e.currentTarget)}
          onFocus={(e) => handleMouseEnter(item.id, e.currentTarget, item)}
          onBlur={(e) => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="masonry-card relative w-full h-full rounded-[10px] shadow-[0px_10px_50px_-10px_rgba(0,0,0,0.2)] overflow-hidden"
            style={{ 
              transformOrigin: "center center",
              willChange: "transform, box-shadow",
            }}
          >
            <div
              className="masonry-image relative w-full h-full bg-cover bg-center transition-all duration-300"
              style={{ 
                backgroundImage: `url(${item.img})`,
                willChange: "background-size",
              }}
            >
              {/* Crop indicator - only show when not expanded */}
              <CropIndicator isVisible={item.showCropIndicator !== false && expandedItem !== item.id} />
              
              {/* Expansion indicator - show when expanded */}
              {expandedItem === item.id && (
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-green-500/80 backdrop-blur-sm rounded-full p-1.5 flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white"
                    >
                      <path
                        d="M9 12L11 14L15 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Hover overlay with hint */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 group-focus:bg-black/20 transition-colors duration-300 rounded-[10px] flex items-center justify-center">
                <div className="hover-hint opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <span className="text-gray-800 text-xs font-medium">
                    {expandedItem === item.id ? "Full image view" : "Hover to expand"}
                  </span>
                </div>
              </div>

              {colorShiftOnHover && (
                <div className="color-overlay absolute inset-0 rounded-[10px] bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Masonry;