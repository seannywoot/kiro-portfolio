import React, { useState } from 'react';
import { Project } from '../../../lib/types';
import { ExternalLink, Github, Eye } from 'lucide-react';
import styles from './Projects.module.css';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
  onClick?: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const renderTechnologyTags = () => (
    <div className={styles.techTags}>
      {project.technologies.map((tech) => (
        <span key={tech} className={styles.techTag}>
          {tech}
        </span>
      ))}
    </div>
  );

  const renderProjectLinks = () => (
    <div className={styles.projectLinks}>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.projectLink}
          aria-label={`View ${project.title} live demo`}
        >
          <ExternalLink size={18} />
          <span>Live Demo</span>
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.projectLink}
          aria-label={`View ${project.title} source code`}
        >
          <Github size={18} />
          <span>Source</span>
        </a>
      )}
    </div>
  );

  const primaryImage = project.images && project.images.length > 0 ? project.images[0] : null;

  const handleCardClick = (event: React.MouseEvent) => {
    // Don't trigger card click if clicking on links
    if ((event.target as HTMLElement).closest('a')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <article 
      className={`${styles.projectCard} ${featured ? styles.featuredCard : ''} ${onClick ? styles.clickableCard : ''}`}
      onClick={handleCardClick}
    >
      {/* Project Image */}
      <div className={styles.imageContainer}>
        {primaryImage && !imageError ? (
          <>
            <img
              src={primaryImage}
              alt={`${project.title} screenshot`}
              className={`${styles.projectImage} ${imageLoaded ? styles.imageLoaded : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className={styles.imagePlaceholder}>
                <Eye size={32} />
              </div>
            )}
          </>
        ) : (
          <div className={styles.imagePlaceholder}>
            <Eye size={32} />
            <span>Preview</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className={styles.imageOverlay}>
          <div className={styles.overlayContent}>
            {renderProjectLinks()}
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className={styles.projectContent}>
        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          {featured && (
            <span className={styles.featuredBadge}>Featured</span>
          )}
        </div>
        
        <p className={styles.projectDescription}>
          {project.description}
        </p>

        {project.longDescription && (
          <p className={styles.projectLongDescription}>
            {project.longDescription}
          </p>
        )}

        {renderTechnologyTags()}
        
        {/* Mobile Links (visible on mobile, hidden on desktop where hover overlay shows them) */}
        <div className={styles.mobileLinks}>
          {renderProjectLinks()}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;