import React from "react";
import { AnimatedText } from "../../common/AnimatedText/AnimatedText";
import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Lanyard } from "../../common/Lanyard";
import styles from "./Hero.module.css";

export interface HeroProps {
  name: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
  avatar?: string;
  className?: string;
}

/**
 * Hero - First impression section with animated introduction
 * Features animated text reveal, parallax background, and call-to-action
 */
export function Hero({
  name,
  title,
  description,
  ctaText,
  onCtaClick,
  avatar,
  className,
  ...props
}: HeroProps & React.HTMLAttributes<HTMLElement>) {
  const scrollToNext = () => {
    const nextSection = document.querySelector('[data-section="tech-marquee"]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center", // ensure vertical stacking
        styles.hero,
        className
      )}
      data-section="hero"
      {...props}
    >
      {/* Lanyard Background */}
      <div className="absolute inset-0 z-0">
        <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} />
      </div>

      {/* Main Content */}
      <div className="w-full px-6 text-center text-[var(--foreground)] relative z-10 flex flex-col items-center justify-center">
        {/* Avatar */}
        {avatar && (
          <div className="mb-8">
            <div
              className={cn(
                "w-32 h-32 mx-auto rounded-full overflow-hidden",
                "ring-4 ring-white/20 ring-offset-4 ring-offset-transparent",
                styles.avatar
              )}
            >
              <img
                src={avatar}
                alt={`${name} - Portfolio`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Animated Name */}
        <AnimatedText
          text={name}
          animation="fadeIn"
          delay={200}
          className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent w-full break-words"
        />

        {/* Animated Title */}
        <AnimatedText
          text={title}
          animation="slideUp"
          delay={600}
          className="text-xl md:text-2xl text-[var(--primary)] mb-6 font-medium"
        />

        {/* Animated Description */}
        <AnimatedText
          text={description}
          animation="fadeIn"
          delay={1000}
          className="text-lg md:text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto leading-relaxed"
        />

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <AnimatedText
            text=""
            animation="fadeIn"
            delay={1400}
            className="contents"
          >
            <Button
              onClick={onCtaClick}
              size="lg"
              className={cn(
                "bg-[var(--primary)] hover:bg-[var(--primary)]/90",
                "text-[var(--primary-foreground)] font-semibold px-8 py-3 rounded-full",
                "transform transition-all duration-300 hover:scale-105",
                "shadow-lg hover:shadow-xl",
                styles.ctaButton
              )}
            >
              {ctaText}
            </Button>
          </AnimatedText>
        </div>
      </div>

      {/* Scroll Indicator - moved higher and outside any container */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30">
        <button
          onClick={scrollToNext}
          className={cn(
            "text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors duration-300",
            "flex flex-col items-center gap-2 group",
            styles.scrollIndicator
          )}
          aria-label="Scroll to next section"
        >
          <span className="text-sm font-medium">Scroll Down</span>
          <ChevronDown
            className="w-6 h-6 animate-bounce group-hover:animate-pulse"
            data-testid="chevron-down"
          />
        </button>
      </div>
    </section>
  );
}

export default Hero;
