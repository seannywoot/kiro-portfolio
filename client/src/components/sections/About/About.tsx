import React from 'react';
import { ParallaxContainer } from '../../common/ParallaxContainer/ParallaxContainer';
import { AboutProps, SkillCategory } from '../../../lib/types';
import ScreenReaderOnly from '../../common/ScreenReaderOnly/ScreenReaderOnly';
import { renderTechnologyIcon } from '../../../lib/portfolio-data';
import TextType from '../../common/TextType';
import styles from './About.module.css';

const About: React.FC<AboutProps> = ({
  personal,
  skills
}) => {
  const renderSkillBar = (skill: unknown, index: number) => {
    const percentage = (skill.level / 5) * 100;
    
    return (
      <div key={skill.name} className={styles.skillItem}>
        <div className={styles.skillHeader}>
          <span className={styles.skillIcon} aria-hidden="true">
            {renderTechnologyIcon({ name: skill.name, icon: skill.icon, category: 'skill', priority: 0 })}
          </span>
          <span className={styles.skillName}>{skill.name}</span>
          <span className={styles.skillLevel} aria-label={`Skill level: ${skill.level} out of 5`}>
            {skill.level}/5
          </span>
        </div>
        <div 
          className={styles.skillBarContainer}
          role="progressbar"
          aria-label={`${skill.name} proficiency`}
          aria-valuenow={skill.level}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuetext={`${skill.level} out of 5`}
        >
          <div 
            className={styles.skillBar}
            style={{
              width: `${percentage}%`,
              animationDelay: `${index * 0.1}s`
            }}
          />
        </div>
        <ScreenReaderOnly>
          {skill.name}: {skill.level} out of 5 proficiency level
        </ScreenReaderOnly>
      </div>
    );
  };

  const renderSkillCategory = (category: SkillCategory) => (
    <div key={category.name} className={styles.skillCategory}>
      <h3 className={styles.categoryTitle}>{category.name}</h3>
      <div className={styles.skillsList}>
        {category.skills.map((skill, skillIndex) => renderSkillBar(skill, skillIndex))}
      </div>
    </div>
  );

  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.content}>
          {/* About Me Section */}
          <div className={styles.aboutContent}>
            <div className={styles.textContent}>
              <h2 id="about-heading" className={styles.sectionTitle}>About Me</h2>
              <div className={styles.personalInfo}>
                <h3 className={styles.name}>{personal.name}</h3>
                <div className={styles.title}>
                  <TextType
                    text={["Front-End Developer", "UI/UX Design", "Graphic Design"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    className={styles.title}
                  />
                </div>
                <p className={styles.bio}>{personal.bio}</p>
              </div>
            </div>
            
            {personal.avatar && (
              <ParallaxContainer speed={0.1} className={styles.avatarContainer}>
                <div className={styles.avatarWrapper}>
                  <img 
                    src={personal.avatar} 
                    alt={`Professional photo of ${personal.name}`}
                    className={styles.avatar}
                    loading="lazy"
                  />
                  <div className={styles.avatarGlow} aria-hidden="true" />
                </div>
              </ParallaxContainer>
            )}
          </div>

          {/* Skills Section */}
          <div className={styles.skillsSection}>
            <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
            <div className={styles.skillsGrid} role="region" aria-label="Skills and proficiency levels">
              {skills.map((category) => renderSkillCategory(category))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;