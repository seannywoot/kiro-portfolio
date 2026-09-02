import React from 'react';

interface NavigationProps {
  sections: Array<{
    id: string;
    label: string;
  }>;
}

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Separate contact section to place it on the right
  const leftSections = sections.filter(
    (s) => s.id !== 'contact' && s.label.toLowerCase() !== 'contact me'
  );
  
  // If contact isn't in sections, provide a fallback to scroll to 'contact'
  const contactSection = sections.find(
    (s) => s.id === 'contact' || s.label.toLowerCase() === 'contact me'
  ) || { id: 'contact', label: 'contact me' };

  return (
    <nav className="absolute top-0 left-0 right-0 w-full z-50 pointer-events-none">
      <div className="max-w-[1920px] mx-auto px-[clamp(1rem,4.5vw,6rem)] py-[clamp(0.75rem,3vh,3.25rem)] flex justify-between items-center text-white pointer-events-auto font-['Hanken_Grotesk',sans-serif]">
        <div className="flex items-center gap-[clamp(0.75rem,2.5vw,2.5rem)]">
          {leftSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-[clamp(0.8125rem,0.5vw+0.6rem,1rem)] font-bold lowercase tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap"
            >
              {section.label === 'Hero' ? 'home' : section.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => scrollToSection(contactSection.id)}
          className="text-[clamp(0.8125rem,0.5vw+0.6rem,1rem)] font-bold lowercase tracking-wide hover:opacity-70 transition-opacity whitespace-nowrap"
        >
          {contactSection.label}
        </button>
      </div>
    </nav>
  );
};

export default Navigation;