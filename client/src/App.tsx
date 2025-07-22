import { useEffect, useState } from 'react';
import { Hero } from './components/sections/Hero/Hero';
import Navigation from './components/common/Navigation/Navigation';
import ScrollProgress from './components/common/ScrollProgress/ScrollProgress';
import ScreenReaderOnly from './components/common/ScreenReaderOnly/ScreenReaderOnly';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import SkeletonLoader from './components/common/SkeletonLoader/SkeletonLoader';
import ModernMarquee from './components/sections/ModernMarquee/ModernMarquee';
import About from './components/sections/About/About';
import WorkExperience from './components/sections/WorkExperience/WorkExperience';
import Projects from './components/sections/Projects/Projects';
import Contact from './components/sections/Contact/Contact';
import { portfolioData } from './lib/portfolio-data';
import { motion } from './lib/accessibility';
import { initializePerformanceMonitoring, ResourceHints } from './lib/performance';

function App() {
  // App loading state
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);

  // Navigation sections configuration
  const navigationSections = [
    { id: 'hero', label: 'Home' },
    { id: 'work-experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  // Handle hero CTA click - scroll to projects
  const handleHeroCTA = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Initialize app and handle loading states
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set up reduced motion preferences
        const cleanup = motion.onReducedMotionChange((prefersReduced) => {
          document.documentElement.setAttribute('data-reduced-motion', prefersReduced.toString());
        });

        // Initialize performance monitoring
        const performanceMonitor = initializePerformanceMonitoring();

        // Add resource hints for better performance
        ResourceHints.dnsPrefetch('fonts.googleapis.com');
        ResourceHints.dnsPrefetch('fonts.gstatic.com');

        // Simulate app initialization (fonts, critical resources)
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mark app as ready
        setIsAppReady(true);
        
        // Add a small delay for smooth transition
        setTimeout(() => {
          setIsAppLoading(false);
        }, 300);

        return () => {
          cleanup();
          performanceMonitor.disconnect();
        };
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsAppLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Show loading screen while app initializes
  if (isAppLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-full max-w-4xl mx-auto px-4">
          <SkeletonLoader variant="hero" />
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Loading portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isAppReady ? 'opacity-100' : 'opacity-0'}`}>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Page header with navigation */}
      <header role="banner" className="transition-transform duration-300 ease-out">
        <Navigation sections={navigationSections} />
        <ScrollProgress />
      </header>

      {/* Main Content */}
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* Hero Section */}
        <section 
          id="hero" 
          aria-labelledby="hero-heading"
          role="region"
          aria-label="Introduction and welcome"
        >
          <Hero
            name={portfolioData.personal.name}
            title={portfolioData.personal.title}
            description={portfolioData.personal.bio}
            ctaText="View My Work"
            onCtaClick={handleHeroCTA}
            avatar={portfolioData.personal.avatar}
          />
        </section>

        <hr className="section-divider" />

        {/* Technologies Section */}
        <ErrorBoundary>
          <section 
            id="technologies" 
            aria-labelledby="technologies-heading"
            role="region"
            aria-label="Technologies and tools showcase"
            className="transition-all duration-700 ease-out"
          >
            <ModernMarquee
              technologies={portfolioData.technologies}
              speed={25}
            />
          </section>
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

        <hr className="section-divider" />

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

        <hr className="section-divider" />

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
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-[var(--card)] text-[var(--card-foreground)] py-12 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                © {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.
              </p>
              <p className="text-xs text-[var(--muted-foreground)]/70">
                Built with React, TypeScript, and Tailwind CSS
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {portfolioData.contact.socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-200 hover:scale-110 interactive"
                  aria-label={`Visit ${social.platform} profile`}
                >
                  <span className="text-lg" role="img" aria-hidden="true">
                    {typeof social.icon === 'string' ? social.icon : '🔗'}
                  </span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-all duration-200 interactive text-sm"
              aria-label="Scroll to top of page"
            >
              <span>Back to top</span>
              <span className="text-xs">↑</span>
            </button>
          </div>
          
          <ScreenReaderOnly>
            End of page content
          </ScreenReaderOnly>
        </div>
      </footer>
    </div>
  );
}

export default App;
