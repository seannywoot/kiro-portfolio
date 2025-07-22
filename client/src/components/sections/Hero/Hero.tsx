import React from "react";
import { AnimatedText } from "../../common/AnimatedText/AnimatedText";
import { Button } from "../../ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Lanyard } from "../../common/Lanyard";
import TextType from "../../common/TextType";
import styles from "./Hero.module.css";

export interface HeroProps {
  name: string;
  title: string;
  description: string;
  ctaText: string;
  onCtaClick: () => void;
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
        "relative min-h-screen overflow-hidden",
        styles.hero,
        className
      )}
      data-section="hero"
      {...props}
    >
      {/* Content container with integrated Lanyard */}
      <div className="relative w-full h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center">
          {/* Left side - Lanyard Component (50% width on desktop) */}
          <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative z-0 mb-8 lg:mb-0">
            <Lanyard position={[-2, 0, 15]} gravity={[0, -40, 0]} fov={15} />
          </div>
          
          {/* Right Side - Text Content (50% width on desktop) */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-[var(--foreground)] flex flex-col justify-center z-10 lg:mt-100">
            {/* Animated Name */}
            <AnimatedText
              text={name}
              animation="fadeIn"
              delay={200}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[var(--foreground)] to-[var(--muted-foreground)] bg-clip-text text-transparent break-words"
            />

            {/* Animated Title with Typing Effect */}
            <div className="text-lg md:text-xl lg:text-2xl text-[var(--primary)] mb-6 font-medium">
              <TextType
                text={["Front-End Developer", "UI/UX Design", "Graphic Design"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
                className="text-lg md:text-xl lg:text-2xl text-[var(--primary)] font-medium"
              />
            </div>

            {/* Animated Description */}
            <AnimatedText
              text={description}
              animation="fadeIn"
              delay={1000}
              className="text-base md:text-lg text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            />

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
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
        </div>
      </div>

      {/* Scroll Indicator */}
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
