import React from 'react';
import { TechMarqueeProps } from '../../../lib/types';
import ScreenReaderOnly from '../../common/ScreenReaderOnly/ScreenReaderOnly';
import DiagonalContainer from './DiagonalContainer';
import LeftSection from './LeftSection';
import RightSection from './RightSection';
import styles from './TechMarquee.module.css';

const TechMarquee: React.FC<TechMarqueeProps> = ({
  technologies,
  speed = 50,
  pauseOnHover = true
}) => {
  return (
    <section className={styles.techMarqueeSection}>
      <div className={styles.container}>
        {/* Screen reader accessible list of technologies */}
        <ScreenReaderOnly>
          <h3>Complete list of technologies:</h3>
          <ul>
            {technologies.map((tech, index) => (
              <li key={`sr-${tech.name}-${index}`}>
                {tech.name} - {tech.category}
              </li>
            ))}
          </ul>
        </ScreenReaderOnly>
        
        <DiagonalContainer>
          <LeftSection 
            title="Technologies & Tools"
            subtitle="Crafting modern experiences with cutting-edge technologies"
          />
          <RightSection 
            technologies={technologies}
            speed={speed}
            pauseOnHover={pauseOnHover}
          />
        </DiagonalContainer>
        
        <ScreenReaderOnly id="tech-description">
          This section displays an animated showcase of {technologies.length} technologies and tools used in development, 
          including {technologies.map(tech => tech.name).join(', ')}.
        </ScreenReaderOnly>
      </div>
    </section>
  );
};

export default TechMarquee;