import React, { useEffect, useState } from "react";
import styles from "./Hero.module.css";

export interface HeroProps {
  name?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

/**
 * Hero Section Component
 * 
 * Implements fluid container-driven scaling and crisp High-DPI <picture> art direction
 * across three core breakpoints:
 * - Mobile (<=767px): Serves 1280px High-DPI WebP asset (2x-3x Retina sharp)
 * - Tablet (768px–1023px): Serves 1920px High-DPI WebP asset (2x Retina sharp)
 * - Laptop/Desktop (>=1024px): Serves 1920px 98% quality WebP asset & uncompressed PNG fallback
 */
export function Hero({ onCtaClick, className = "" }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleScrollClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const targetSection =
        document.getElementById("projects") ||
        document.getElementById("technologies") ||
        document.getElementById("about");
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <section
      id="hero"
      aria-label="Introduction and hero section"
      className={`relative w-full overflow-hidden flex flex-col justify-between select-none ${styles.heroContainer} ${className}`}
    >
      {/* 
        Art-Directed Responsive <picture> Tag:
        Serves High-DPI Retina-ready WebP assets to prevent any blurring on mobile, tablet, or desktop displays.
      */}
      <picture className={styles.pictureWrapper}>
        {/* Laptop / Desktop Breakpoint (>=1024px) */}
        <source
          media="(min-width: 1024px)"
          type="image/webp"
          srcSet="/Hero%20Section/hero-desktop.webp"
        />
        <source
          media="(min-width: 1024px)"
          type="image/png"
          srcSet="/Hero%20Section/Hero%20Section.png"
        />

        {/* Tablet Breakpoint (768px - 1023px) */}
        <source
          media="(min-width: 768px)"
          type="image/webp"
          srcSet="/Hero%20Section/hero-tablet.webp"
        />

        {/* Mobile Breakpoint (<=767px) - 1280px High-DPI asset */}
        <source type="image/webp" srcSet="/Hero%20Section/hero-mobile.webp" />
        <img
          src="/Hero%20Section/Hero%20Section.png"
          alt="Seann Tamondong - Front-End Developer"
          className={styles.heroImg}
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* Background Contrast Protection Layer */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Main Foreground Content Layer */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-12 sm:pt-16 lg:pt-24 pb-8 flex-1 flex flex-col justify-between">
        
        {/* Grid Content: 3-column auto-layout on desktop, 1-column stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center flex-1 my-auto">
          
          {/* Top-Left Column: Headline & Subtitle */}
          <div
            className={`lg:col-span-5 flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-6 z-20 ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "150ms" }}
          >
            <h1
              id="hero-heading"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-[5.25rem] font-extrabold tracking-[-0.035em] leading-[0.93] text-white font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-md"
            >
              Structured <br />
              <span className="text-white/95">by design</span>
            </h1>
            
            <p className="text-xs sm:text-base lg:text-[1.05rem] text-slate-200/95 font-normal leading-relaxed max-w-md font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-sm">
              Interfaces built around clear hierarchy and seamless motion—where
              visual refinement serves real utility.
            </p>
          </div>

          {/* Center Gap: Preserves subject portrait visibility */}
          <div className="hidden lg:block lg:col-span-2 min-h-[300px]" aria-hidden="true" />

          {/* Bottom-Right Column: Name & Role Title */}
          <div
            className={`lg:col-span-5 flex flex-col justify-center lg:items-end text-left lg:text-right space-y-2 sm:space-y-3 z-20 ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "400ms" }}
          >
            <div className="flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-[4.75rem] font-extrabold tracking-[-0.035em] leading-[0.93] text-white drop-shadow-md">
                Seann
              </h2>
              <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-6xl xl:text-[4.75rem] font-extrabold tracking-[-0.035em] leading-[0.93] text-white drop-shadow-md">
                Tamondong
              </h2>
            </div>

            <div className="pt-2 border-t-2 border-white/80 inline-block lg:ml-auto">
              <span className="text-xs sm:text-sm lg:text-base font-semibold tracking-[0.22em] text-white uppercase block font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-sm">
                FRONT-END DEVELOPER
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Baseline Rule & Interactive Controls */}
        <div
          className={`mt-auto pt-4 sm:pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 z-20 ${
            isLoaded ? styles.fadeIn : "opacity-0"
          }`}
          style={{ animationDelay: "650ms" }}
        >
          <div className="text-[11px] sm:text-xs text-slate-300/80 font-mono tracking-wider">
            PORTFOLIO / SEANN TAMONDONG
          </div>

          <button
            onClick={handleScrollClick}
            className="group flex items-center space-x-3 text-xs sm:text-sm font-semibold tracking-wider text-slate-200 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full px-5 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-sm cursor-pointer"
            aria-label="Explore projects section"
          >
            <span>EXPLORE WORK</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}

export default Hero;
