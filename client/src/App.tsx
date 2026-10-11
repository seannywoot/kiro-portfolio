import { useEffect, useState } from "react";
import { Hero } from "./components/sections/Hero/Hero";
import Navigation from "./components/common/Navigation/Navigation";
import ScreenReaderOnly from "./components/common/ScreenReaderOnly/ScreenReaderOnly";
import ErrorBoundary from "./components/common/ErrorBoundary/ErrorBoundary";
import Preloader from "./components/common/Preloader/Preloader";
import Services from "./components/sections/Services/Services";
import About from "./components/sections/About/About";
import WorkExperience from "./components/sections/WorkExperience/WorkExperience";
import Projects from "./components/sections/Projects/Projects";
import Contact from "./components/sections/Contact/Contact";
import Footer from "./components/sections/Footer";
import { portfolioData } from "./lib/portfolio-data";
import { motion } from "./lib/accessibility";
import {
  initializePerformanceMonitoring,
  ResourceHints,
} from "./lib/performance";
import { detectDeviceCapabilities, applyPerformanceOptimizations } from "./lib/device-detection";

function App() {
  const [isPreloading, setIsPreloading] = useState(true);
  const [isHeroReady, setIsHeroReady] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // Navigation sections configuration
  const navigationSections = [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "work-experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  // Handle hero CTA click - scroll to services
  const handleHeroCTA = () => {
    const servicesSection = document.getElementById("services");
    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Initialize app optimizations
  useEffect(() => {
    // Detect device capabilities and apply optimizations
    const deviceCapabilities = detectDeviceCapabilities();
    applyPerformanceOptimizations(deviceCapabilities);

    // Set up reduced motion preferences
    const cleanup = motion.onReducedMotionChange((prefersReduced) => {
      document.documentElement.setAttribute(
        "data-reduced-motion",
        prefersReduced.toString()
      );
    });

    // Initialize performance monitoring
    const performanceMonitor = initializePerformanceMonitoring();

    // Add resource hints for better performance
    ResourceHints.dnsPrefetch("fonts.googleapis.com");
    ResourceHints.dnsPrefetch("fonts.gstatic.com");

    setIsAppReady(true);

    return () => {
      cleanup();
      performanceMonitor.disconnect();
    };
  }, []);

  return (
    <>
      {isPreloading && (
        <Preloader
          onStartExit={() => setIsHeroReady(true)}
          onComplete={() => {
            setIsHeroReady(true);
            setIsPreloading(false);
          }}
        />
      )}
      <div
        className={`min-h-screen max-w-full overflow-x-clip transition-opacity duration-700 ${
          isAppReady ? "opacity-100" : "opacity-0"
        }`}
      >
      {/* Page header with navigation */}
      <header role="banner" className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <Navigation sections={navigationSections} />
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* Sticky Hero Section (Pinned under incoming parallax content) */}
        <div className="sticky top-0 z-0 h-screen h-[100dvh] w-full overflow-hidden will-change-transform">
          <Hero isReady={isHeroReady} onCtaClick={handleHeroCTA} />
        </div>

        {/* Parallax Content Stream (Slides smoothly on top of Hero) */}
        <div className="relative z-10 w-full bg-[#121316]">
          {/* Services Section */}
          <ErrorBoundary>
            <Services />
          </ErrorBoundary>

          <hr className="section-divider" />

          {/* About Section */}
          <ErrorBoundary>
            <section
              id="about"
              aria-labelledby="about-heading"
              role="region"
              aria-label="About me and skills"
              className="transition-all duration-700 ease-out"
            >
              <About
                personal={portfolioData.personal}
                skills={portfolioData.skills}
              />
            </section>
          </ErrorBoundary>

          {/* Work Experience Section */}
          <ErrorBoundary>
            <section
              id="work-experience"
              aria-labelledby="work-experience-heading"
              role="region"
              aria-label="Professional work experience"
              className="transition-all duration-700 ease-out"
            >
              <WorkExperience workExperience={portfolioData.workExperience} />
            </section>
          </ErrorBoundary>

          {/* Projects Section */}
          <ErrorBoundary>
            <section
              id="projects"
              aria-labelledby="projects-heading"
              role="region"
              aria-label="Portfolio projects"
              className="transition-all duration-700 ease-out"
            >
              <Projects projects={portfolioData.projects} />
            </section>
          </ErrorBoundary>

          <hr className="section-divider" />

          {/* Contact Section */}
          <ErrorBoundary>
            <section
              id="contact"
              aria-labelledby="contact-heading"
              role="region"
              aria-label="Contact information and form"
              className="transition-all duration-700 ease-out"
            >
              <Contact contact={portfolioData.contact} />
            </section>
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <Footer
        personal={portfolioData.personal}
        contact={portfolioData.contact}
      />
    </div>
    </>
  );
}

export default App;
