import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '../../ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '../../ui/navigation-menu';
import { cn } from '../../../lib/utils';

interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollOffset = scrollPosition + 100; // Offset for better section detection
      
      // Update scroll state for glassmorphism effect
      setIsScrolled(scrollPosition > 50);

      // Update active section
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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

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
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out w-full flex justify-center">
      <div 
        className={cn(
          "relative rounded-2xl px-10 py-4 transition-all duration-300 ease-out max-w-5xl w-full",
          "border border-border/40 shadow-2xl flex items-center justify-between gap-4",
          isScrolled 
            ? "bg-[var(--surface-elevated)]/95 backdrop-blur-xl" 
            : "bg-[var(--surface-elevated)]/90 backdrop-blur-md"
        )}
        style={{
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.08), 0 0 40px rgba(var(--primary-rgb, 59, 130, 246), 0.18)' 
            : '0 4px 16px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* Left: Brand */}
        <div className="flex-1 flex items-center min-w-0">
          <Button
            variant="ghost"
            onClick={() => scrollToSection('hero')}
            className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hover:bg-transparent px-3 py-2"
          >
            Portfolio
          </Button>
        </div>
        {/* Center: Nav Links */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-2">
                {sections.map((section) => (
                  <NavigationMenuItem key={section.id}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "cursor-pointer px-4 py-2 rounded-xl transition-all duration-200",
                        "hover:bg-primary/10 hover:text-primary",
                        activeSection === section.id && "bg-primary/15 text-primary font-medium"
                      )}
                      onClick={() => scrollToSection(section.id)}
                    >
                      {section.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* Right: Theme Toggle and Mobile Menu */}
        <div className="flex-1 flex items-center justify-end min-w-0 gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="h-9 w-9 rounded-xl hover:bg-primary/10"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-xl hover:bg-primary/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 rounded-xl bg-background/90 backdrop-blur-xl border border-border/20 shadow-xl">
            <div className="p-3 space-y-1">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="ghost"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    "w-full justify-center text-center rounded-lg transition-all duration-200",
                    "hover:bg-primary/10 hover:text-primary",
                    activeSection === section.id && "bg-primary/15 text-primary font-medium"
                  )}
                >
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;