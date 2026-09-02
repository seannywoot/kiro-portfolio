import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 40);

      const scrollOffset = scrollPosition + 160;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollOffset >= offsetTop && scrollOffset < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  // Separate contact section to place it on the right
  const leftSections = sections.filter(
    (s) => s.id !== 'contact' && s.label.toLowerCase() !== 'contact me'
  );

  // Contact section with fallback label
  const contactSection = sections.find(
    (s) => s.id === 'contact' || s.label.toLowerCase() === 'contact me'
  ) || { id: 'contact', label: 'contact me' };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 pointer-events-none transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-gradient-to-r from-white/[0.12] via-white/[0.04] to-white/[0.08] bg-neutral-950/40 backdrop-blur-2xl border-b border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
    >
      <div
        className={`max-w-[1920px] mx-auto px-[clamp(1rem,4.5vw,6rem)] flex justify-between items-center text-white pointer-events-auto font-['Hanken_Grotesk',sans-serif] relative transition-all duration-300 ease-out ${
          isScrolled ? 'py-3.5 md:py-4' : 'py-[clamp(0.75rem,3vh,3.25rem)]'
        }`}
      >

        {/* Left Side: Hamburger on <768px (mobile), Inline links on >=768px (desktop) */}
        <div className="relative">
          {/* Mobile Hamburger Icon (<768px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-1.5 rounded-lg bg-transparent hover:bg-white/10 transition-colors border-0 outline-none shadow-none hover:shadow-none !shadow-none"
            style={{ boxShadow: 'none' }}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <img
              src="/Hero%20Section/sort.png"
              alt="Menu"
              className="w-5 h-5 object-contain filter invert brightness-200"
            />
          </button>

          {/* Desktop Inline Links (>=768px) */}
          <div className="hidden md:flex items-center gap-[clamp(1rem,2.5vw,2.75rem)]">
            {leftSections.map((section) => {
              const isActive = activeSection === section.id;
              const displayLabel = section.label.toLowerCase() === 'hero' ? 'home' : section.label.toLowerCase();
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="group relative py-1 bg-transparent border-0 outline-none shadow-none hover:shadow-none hover:bg-transparent hover:transform-none text-[clamp(0.8125rem,0.5vw+0.6rem,1rem)] font-bold lowercase tracking-wide whitespace-nowrap !shadow-none !bg-transparent cursor-pointer"
                  style={{ boxShadow: 'none' }}
                >
                  <span
                    className={isActive ? 'nav-fill-accent-active' : 'nav-fill-accent'}
                  >
                    {displayLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Menu Dropdown (<768px) - Realistic Frosted Glassmorphism */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 mt-3 py-4 px-5 bg-gradient-to-br from-white/[0.16] via-white/[0.04] to-black/50 bg-neutral-950/40 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl flex flex-col gap-3 z-50 min-w-[180px]">
              {leftSections.map((section) => {
                const isActive = activeSection === section.id;
                const displayLabel = section.label.toLowerCase() === 'hero' ? 'home' : section.label.toLowerCase();
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="text-left text-sm font-bold lowercase tracking-wide py-1 flex items-center justify-between bg-transparent border-0 outline-none shadow-none hover:shadow-none hover:bg-transparent hover:transform-none !shadow-none !bg-transparent cursor-pointer"
                    style={{ boxShadow: 'none' }}
                  >
                    <span className={isActive ? 'nav-fill-accent-active font-extrabold' : 'nav-fill-accent'}>
                      {displayLabel}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D45B34] ml-2 shadow-[0_0_8px_rgba(212,91,52,0.8)]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Contact Me button with diagonal upward arrow */}
        <button
          onClick={() => scrollToSection(contactSection.id)}
          className="group flex items-center gap-1.5 py-1 bg-transparent border-0 outline-none shadow-none hover:shadow-none hover:bg-transparent hover:transform-none text-[clamp(0.8125rem,0.5vw+0.6rem,1rem)] font-bold lowercase tracking-wide whitespace-nowrap !shadow-none !bg-transparent cursor-pointer"
          style={{ boxShadow: 'none' }}
        >
          <span
            className={
              activeSection === contactSection.id
                ? 'nav-fill-accent-active'
                : 'nav-fill-accent'
            }
          >
            contact me
          </span>
          <ArrowUpRight
            className={`w-4 h-4 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
              activeSection === contactSection.id
                ? 'text-[#D45B34]'
                : 'text-[#ECEEF2] group-hover:text-[#D45B34]'
            }`}
          />
        </button>
      </div>
    </nav>
  );
};

export default Navigation;