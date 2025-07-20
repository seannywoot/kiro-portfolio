import { useEffect, useState } from 'react';
import { Hero } from './components/sections/Hero/Hero';
import Navigation from './components/common/Navigation/Navigation';
import ScrollProgress from './components/common/ScrollProgress/ScrollProgress';
import ScreenReaderOnly from './components/common/ScreenReaderOnly/ScreenReaderOnly';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import LazySection from './components/common/LazySection/LazySection';
import LoadingSpinner from './components/common/LoadingSpinner/LoadingSpinner';
import { 
  ModernMarqueeWithLoading,
  AboutWithLoading,
  ProjectsWithLoading,
  ContactWithLoading
} from './components/sections/LazyComponents';
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
    { id: 'technologies', label: 'Technologies' },
    { id: 'about', label: 'About' },
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-slate-400 text-sm">Loading portfolio...</p>
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
      <main id="main-content" role="main">
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

        {/* Technologies Section */}
        <ErrorBoundary>
          <LazySection rootMargin="200px">
            <section 
              id="technologies" 
              aria-labelledby="technologies-heading"
              role="region"
              aria-label="Technologies and tools showcase"
              className="transition-all duration-700 ease-out"
            >
              <ModernMarqueeWithLoading
                technologies={portfolioData.technologies}
                speed={25}
              />
            </section>
          </LazySection>
        </ErrorBoundary>

        {/* About Section */}
        <ErrorBoundary>
          <LazySection rootMargin="200px">
            <section 
              id="about" 
              aria-labelledby="about-heading"
              role="region"
              aria-label="About me and skills"
              className="transition-all duration-700 ease-out"
            >
              <AboutWithLoading
                personal={portfolioData.personal}
                skills={portfolioData.skills}
              />
            </section>
          </LazySection>
        </ErrorBoundary>

        {/* Projects Section */}
        <ErrorBoundary>
          <LazySection rootMargin="200px">
            <section 
              id="projects" 
              aria-labelledby="projects-heading"
              role="region"
              aria-label="Portfolio projects"
              className="transition-all duration-700 ease-out"
            >
              <ProjectsWithLoading projects={portfolioData.projects} />
            </section>
          </LazySection>
        </ErrorBoundary>

        {/* Contact Section */}
        <ErrorBoundary>
          <LazySection rootMargin="200px">
            <section 
              id="contact" 
              aria-labelledby="contact-heading"
              role="region"
              aria-label="Contact information and form"
              className="transition-all duration-700 ease-out"
            >
              <ContactWithLoading contact={portfolioData.contact} />
            </section>
          </LazySection>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 border-t border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-400 mb-2">
                © {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.
              </p>
              <p className="text-xs text-slate-500">
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
                  className="text-slate-400 hover:text-white transition-all duration-200 hover:scale-110 interactive"
                  aria-label={`Visit ${social.platform} profile`}
                >
                  <span className="text-lg" role="img" aria-hidden="true">
                    {typeof social.icon === 'string' ? social.icon : '🔗'}
                  </span>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200 interactive text-sm"
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
