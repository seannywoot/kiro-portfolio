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
 * Implements Figma Auto Layout Strategy across 3 Breakpoints:
 * - Mobile (<=767px): Vertical stack layout, fill-width touch targets (min 44px), headline omitted for subject focus.
 * - Tablet (768px–1023px): 12-column fluid grid, fluid clamp typography, side-by-side auto layout.
 * - Laptop/Desktop (>=1024px): Full 3-column auto layout (Headline Hug -> Subject Window -> Name/Role Hug).
 * 
 * Typography & Sizing Modes:
 * - Headline & Subtitle: clamp() sizing, fit-content hug with max-width fill constraints.
 * - Name & Position: clamp() sizing, anchored to bottom-right with predictable gap.
 * - CTA Button: 44px min touch target, fill-width on mobile, hug-content on tablet/desktop.
 * - Contrast Scrim: WCAG AA 4.5:1 compliant contrast ratio across all device backgrounds.
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
      className={`${styles.heroContainer} ${className}`}
    >
      {/* 
        Art-Directed Responsive Background Picture (Zero CLS):
        - Desktop: High-res WebP / PNG asset
        - Tablet: 1024px+ High-DPI WebP asset
        - Mobile: 720p High-DPI WebP asset
      */}
      <picture className={styles.pictureWrapper}>
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
        <source
          media="(min-width: 768px)"
          type="image/webp"
          srcSet="/Hero%20Section/hero-tablet.webp"
        />
        <source type="image/webp" srcSet="/Hero%20Section/hero-mobile.webp" />
        <img
          src="/Hero%20Section/Hero%20Section.png"
          alt="Seann Tamondong - Front-End Developer"
          className={styles.heroImg}
          loading="eager"
          decoding="async"
        />
      </picture>

      {/* WCAG AA 4.5:1 Contrast Scrim Overlay */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Figma Auto Layout Main Frame */}
      <div className={styles.autoLayoutMainFrame}>
        
        {/* Middle Content Auto Layout Frame (Responsive Grid / Stack) */}
        <div className={styles.contentGrid}>
          
          {/* Top-Left Headline & Subtitle Frame (Auto Layout: Gap + Hug Sizing) */}
          <div
            className={`${styles.headlineFrame} ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "150ms" }}
          >
            <h1 id="hero-heading" className={styles.headlineText}>
              Structured <br />
              <span className="text-white/95">by design</span>
            </h1>
            
            <p className={styles.subheadlineText}>
              Interfaces built around clear hierarchy and seamless motion—where
              visual refinement serves real utility.
            </p>
          </div>

          {/* Center Subject Spacer (Preserves Subject Face Framing on Desktop) */}
          <div className={styles.centerSubjectSpacer} aria-hidden="true" />

          {/* Bottom-Right Name & Role Frame (Auto Layout: Vertical Gap + End Alignment) */}
          <div
            className={`${styles.nameFrame} ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "400ms" }}
          >
            <div className={styles.nameGroup}>
              <h2 className={styles.nameText}>Seann</h2>
              <h2 className={styles.nameText}>Tamondong</h2>
            </div>

            <span className={styles.roleText}>
              FRONT-END DEVELOPER
            </span>
          </div>

        </div>

        {/* Bottom Baseline & Interactive Controls Frame (Auto Layout: Space-Between) */}
        <div
          className={`${styles.bottomControlsFrame} ${
            isLoaded ? styles.fadeIn : "opacity-0"
          }`}
          style={{ animationDelay: "650ms" }}
        >
          <div className={styles.metaInfoText}>
            PORTFOLIO / SEANN TAMONDONG
          </div>

          <button
            onClick={handleScrollClick}
            className={styles.ctaButton}
            aria-label="Explore projects section"
          >
            <span>EXPLORE WORK</span>
            <svg
              className={styles.ctaIcon}
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
