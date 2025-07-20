import React from 'react';
import ModernMarquee from '../components/sections/ModernMarquee';
import { portfolioData } from '../lib/portfolio-data';

const ModernMarqueeDemo: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <ModernMarquee 
        technologies={portfolioData.technologies}
        speed={25}
        pauseOnHover={true}
      />
    </div>
  );
};

export default ModernMarqueeDemo;