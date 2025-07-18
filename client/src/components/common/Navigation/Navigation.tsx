import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { keyboard, focusManagement } from '../../../lib/accessibility';
import styles from './Navigation.module.css';

interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Offset for better detection

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Enhanced accessibility for mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      // Trap focus in mobile menu
      const cleanup = mobileNavRef.current ? focusManagement.trapFocus(mobileNavRef.current) : undefined;
      
      // Handle escape key
      const escapeCleanup = keyboard.onEscape(() => {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      });

      return () => {
        cleanup?.();
        escapeCleanup();
      };
    }
  }, [isMenuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <button 
            onClick={() => scrollToSection('hero')}
            className={styles.brandButton}
          >
            Portfolio
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`${styles.navLink} ${
                activeSection === section.id ? styles.activeLink : ''
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          className={styles.mobileMenuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          ref={mobileNavRef}
          id="mobile-navigation"
          className={styles.mobileNav}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`${styles.mobileNavLink} ${
                activeSection === section.id ? styles.activeMobileLink : ''
              }`}
              role="menuitem"
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;