import React, { useEffect, useState, useCallback } from "react";
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
 * Hero Section Component - Editorial & Minimalist Edition
 */
export function Hero({ onCtaClick, className = "" }: HeroProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const roles = [
    "FRONT-END DEVELOPER",
    "UI/UX DESIGNER",
    "GRAPHIC DESIGNER",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 60);
    return () => clearTimeout(timer);
  }, []);

  // Smooth editorial role rotator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTransitioning(false);
      }, 350);
    }, 3200);

    return () => clearInterval(interval);
  }, [roles.length]);

  // Subtle interactive ambient glow for desktop
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMousePos(null);
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
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 
        Art-Directed Responsive Background Picture (Zero CLS):
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
          className={`${styles.heroImg} ${imgLoaded ? styles.heroImgLoaded : ""}`}
          loading="eager"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
        />
      </picture>

      {/* WCAG Contrast Scrim Overlay */}
      <div className={styles.heroOverlay} aria-hidden="true" />

      {/* Ambient Interactive Spotlight */}
      {mousePos && (
        <div
          className={styles.ambientSpotlight}
          style={{
            background: `radial-gradient(750px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 91, 52, 0.08), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Auto Layout Frame */}
      <div className={styles.autoLayoutMainFrame}>
        
        {/* Middle Content Auto Layout Frame */}
        <div className={styles.contentGrid}>
          
          {/* Top-Left Headline & Subtitle Frame */}
          <div
            className={`${styles.headlineFrame} ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "150ms" }}
          >
            <h1 id="hero-heading" className={styles.headlineText}>
              Structured <br />
              <span className={styles.headlineHighlight}>by design</span>
            </h1>
            
            <p className={styles.subheadlineText}>
              Interfaces built around clear hierarchy and seamless <br />
              motion—where visual refinement serves real utility.
            </p>
          </div>

          {/* Center Subject Spacer */}
          <div className={styles.centerSubjectSpacer} aria-hidden="true" />

          {/* Bottom-Right Name & Role Frame */}
          <div
            className={`${styles.nameFrame} ${
              isLoaded ? styles.fadeInUp : "opacity-0"
            }`}
            style={{ animationDelay: "380ms" }}
          >
            <div className={styles.nameGroup}>
              <h2 className={styles.nameText}>Seann</h2>
              <h2 className={styles.nameText}>Tamondong</h2>
            </div>

            <div className={styles.roleWrapper}>
              <span className={styles.roleDot} aria-hidden="true" />
              <span
                key={roleIndex}
                className={`${styles.roleText} ${
                  isTransitioning ? styles.roleExiting : styles.roleEntering
                }`}
              >
                {roles[roleIndex]}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Baseline & Interactive Controls Frame */}
        <div
          className={`${styles.bottomControlsFrame} ${
            isLoaded ? styles.fadeIn : "opacity-0"
          }`}
          style={{ animationDelay: "600ms" }}
        >
          <div className={styles.metaInfoText}>
            <span className={styles.metaStatusDot} aria-hidden="true" />
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
